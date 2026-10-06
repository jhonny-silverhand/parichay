#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(DeviceToolsPlugin, "DeviceTools",
    CAP_PLUGIN_METHOD(getScreenMetrics, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(setLockScreenWallpaper, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(openWallpaperPicker, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(saveImageToGallery, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(openGoogleWallet, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(keepScreenOn, CAPPluginReturnPromise);
)
