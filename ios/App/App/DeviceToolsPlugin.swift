import Foundation
import Capacitor
import UIKit

@objc(DeviceToolsPlugin)
public class DeviceToolsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "DeviceToolsPlugin"
    public let jsName = "DeviceTools"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getScreenMetrics", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setLockScreenWallpaper", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openWallpaperPicker", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveImageToGallery", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openGoogleWallet", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "keepScreenOn", returnType: CAPPluginReturnPromise)
    ]

    @objc func getScreenMetrics(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let screen = UIScreen.main
            let bounds = screen.bounds
            let scale = screen.scale
            call.resolve([
                "widthPx": bounds.width * scale,
                "heightPx": bounds.height * scale,
                "density": scale
            ])
        }
    }

    @objc func setLockScreenWallpaper(_ call: CAPPluginCall) {
        call.resolve([
            "success": false,
            "error": "iOS does not support programmatic lock screen wallpaper setting. Save to Photos and apply in Settings."
        ])
    }

    @objc func openWallpaperPicker(_ call: CAPPluginCall) {
        call.resolve(["success": false])
    }

    @objc func saveImageToGallery(_ call: CAPPluginCall) {
        guard let dataUrl = call.getString("dataUrl"),
              let commaIndex = dataUrl.firstIndex(of: ",") else {
            call.reject("Valid dataUrl is required")
            return
        }

        let base64String = String(dataUrl[dataUrl.index(after: commaIndex)...])
        guard let imageData = Data(base64Encoded: base64String),
              let image = UIImage(data: imageData) else {
            call.reject("Could not decode image")
            return
        }

        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
        call.resolve(["success": true])
    }

    @objc func openGoogleWallet(_ call: CAPPluginCall) {
        call.resolve(["success": false])
    }

    @objc func keepScreenOn(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled", false)
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = enabled
            call.resolve(["success": true])
        }
    }
}
