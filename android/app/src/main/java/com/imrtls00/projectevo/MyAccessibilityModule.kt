package com.imrtls00.projectevo

import android.content.Intent
import android.provider.Settings
import android.text.TextUtils
import com.facebook.react.bridge.*
import android.util.Log
import com.facebook.react.modules.core.DeviceEventManagerModule

class MyAccessibilityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        instance = this  // Store instance for access in MyAccessibilityService
    }

    override fun getName(): String {
        return "MyAccessibilityModule"
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun isAccessibilityEnabled(callback: Callback) {
        val context = reactApplicationContext
        val enabledServicesSetting = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        )
        val colonSplitter = TextUtils.SimpleStringSplitter(':')
        colonSplitter.setString(enabledServicesSetting ?: "")
        var enabled = false
        while (colonSplitter.hasNext()) {
            val componentName = colonSplitter.next()
            if (componentName.contains(context.packageName)) {
                enabled = true
                break
            }
        }
        callback.invoke(enabled)
    }

    companion object {
        private var instance: MyAccessibilityModule? = null

        fun getReactContext(): ReactApplicationContext? {
            return instance?.reactApplicationContext
        }

        fun sendEventToReactNative(text: String) {
            val reactContext = getReactContext()
            if (reactContext != null && reactContext.hasActiveReactInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("ScreenContentExtracted", text)
            } else {
                Log.e("MyAccessibilityModule", "React Context is null or inactive")
            }
        }
    }
}
