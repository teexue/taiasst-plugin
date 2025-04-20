// 插件初始化函数
#[no_mangle]
pub extern "C" fn plugin_init() -> i32 {
    println!("Plugin initialized!");
    return 0;
}

// 插件清理函数
#[no_mangle]
pub extern "C" fn plugin_cleanup() -> i32 {
    println!("Plugin cleaned up!");
    return 0;
}
