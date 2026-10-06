package com.example.parichay;

import android.app.WallpaperManager;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

@CapacitorPlugin(name = "DeviceTools")
public class DeviceToolsPlugin extends Plugin {

    @PluginMethod
    public void getScreenMetrics(PluginCall call) {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getRealMetrics(metrics);

        JSObject ret = new JSObject();
        ret.put("widthPx", metrics.widthPixels);
        ret.put("heightPx", metrics.heightPixels);
        ret.put("density", metrics.density);
        call.resolve(ret);
    }

    @PluginMethod
    public void setLockScreenWallpaper(PluginCall call) {
        String dataUrl = call.getString("dataUrl");
        Boolean alsoHome = call.getBoolean("alsoHome", false);

        if (dataUrl == null || !dataUrl.contains(",")) {
            call.reject("dataUrl is required and must be valid base64 data");
            return;
        }

        try {
            String base64Data = dataUrl.substring(dataUrl.indexOf(",") + 1);
            byte[] decoded = Base64.decode(base64Data, Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decoded, 0, decoded.length);

            if (bitmap == null) {
                call.reject("Failed to decode bitmap from dataUrl");
                return;
            }

            WallpaperManager wm = WallpaperManager.getInstance(getContext());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                int which = WallpaperManager.FLAG_LOCK;
                if (Boolean.TRUE.equals(alsoHome)) {
                    which |= WallpaperManager.FLAG_SYSTEM;
                }
                wm.setBitmap(bitmap, null, true, which);
            } else {
                wm.setBitmap(bitmap);
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Could not set lock screen wallpaper: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openWallpaperPicker(PluginCall call) {
        try {
            Intent intent = new Intent(Intent.ACTION_SET_WALLPAPER);
            getActivity().startActivity(Intent.createChooser(intent, "Set Wallpaper"));
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Could not open wallpaper picker: " + e.getMessage());
        }
    }

    @PluginMethod
    public void saveImageToGallery(PluginCall call) {
        String dataUrl = call.getString("dataUrl");
        String filename = call.getString("filename", "parichay-card.png");

        if (dataUrl == null || !dataUrl.contains(",")) {
            call.reject("Valid dataUrl is required");
            return;
        }

        try {
            String base64Data = dataUrl.substring(dataUrl.indexOf(",") + 1);
            byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);

            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.DISPLAY_NAME, filename);
            values.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Parichay");
                values.put(MediaStore.Images.Media.IS_PENDING, 1);
            }

            Uri uri = getContext().getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            if (uri == null) {
                call.reject("Failed to create MediaStore entry");
                return;
            }

            try (OutputStream out = getContext().getContentResolver().openOutputStream(uri)) {
                if (out != null) {
                    out.write(bytes);
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.clear();
                values.put(MediaStore.Images.Media.IS_PENDING, 0);
                getContext().getContentResolver().update(uri, values, null, null);
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("uri", uri.toString());
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to save image to gallery: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openGoogleWallet(PluginCall call) {
        try {
            Intent intent = getContext().getPackageManager().getLaunchIntentForPackage("com.google.android.apps.walletnfcrel");
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            } else {
                Intent webIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=com.google.android.apps.walletnfcrel"));
                webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(webIntent);
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            }
        } catch (Exception e) {
            call.reject("Failed to launch Google Wallet: " + e.getMessage());
        }
    }

    @PluginMethod
    public void keepScreenOn(PluginCall call) {
        final Boolean enabled = call.getBoolean("enabled", false);
        getActivity().runOnUiThread(() -> {
            if (Boolean.TRUE.equals(enabled)) {
                getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            } else {
                getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        });
    }
}
