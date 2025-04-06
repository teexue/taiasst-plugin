// 插件初始化函数
#[no_mangle]
pub extern "C" fn plugin_init() -> i32 {
    println!("Plugin initialized!");
    0 // 返回0表示成功
}

// 插件清理函数
#[no_mangle]
pub extern "C" fn plugin_cleanup() -> i32 {
    println!("Plugin cleaned up!");
    0 // 返回0表示成功
}

// 示例函数：使用插件提供的功能
#[no_mangle]
pub extern "C" fn plugin_process(input: i32) -> i32 {
    // 在这里实现您的插件功能
    input * 2
} 