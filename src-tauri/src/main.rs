// This code was borrowed from the following project: https://github.com/dieharders/example-tauri-python-server-sidecar

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use command_group::CommandGroup;
use serde::Deserialize;
use std::process::Command;
use std::sync::mpsc::{sync_channel, Receiver};
use std::thread;
use tauri::api::path::config_dir;
use tauri::api::process::Command as TCommand;
use tauri::WindowEvent;

#[derive(Deserialize, Debug)]
struct Config {
    torrcPath: String,
    backUpDirName: String,
    torIp: String,
    torPort: u16,
}
fn start_backend(receiver: Receiver<i32>) {
    let config_path = "/etc/tor";
    // ファイルの中身をデバッグ
    let config_str = std::fs::read_to_string(format!("{}/torito.toml", config_path))
        .expect("Failed to read file.");
    let config: Config = toml::from_str(&config_str).expect("Failed to parse toml.");

    // `new_sidecar()` expects just the filename, NOT the whole path
    let t = TCommand::new_sidecar("torito-prototype")
        .expect("[Error] Failed to create new sidecar command.")
        .args(&[
            "--torrcPath",
            &config.torrcPath,
            "--backUpDirName",
            &config.backUpDirName,
            "--torIp",
            &config.torIp,
            "--torPort",
            &config.torPort.to_string(),
        ]);

    println!("t: {:?}", t);
    let mut group = Command::from(t)
        .group_spawn()
        .expect("[Error] spawning api server process.");
    // If anyone knows how to log out stdout msg's from this process drop a comment. Rust is not my language.
    thread::spawn(move || loop {
        let s = receiver.recv();
        if s.unwrap() == -1 {
            group.kill().expect("[Error] killing api server process.");
        }
    });
}

fn main() {
    // Startup the python binary (api service)
    let (tx, rx) = sync_channel(1);
    start_backend(rx);

    tauri::Builder::default()
        // Tell the child process to shutdown when app exits
        .on_window_event(move |event| match event.event() {
            WindowEvent::Destroyed => {
                tx.send(-1).expect("[Error] sending msg.");
                println!("[Event] App closed, shutting down API...");
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("[Error] while running tauri application");
}
