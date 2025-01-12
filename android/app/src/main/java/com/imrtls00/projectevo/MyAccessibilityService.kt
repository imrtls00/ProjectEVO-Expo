package com.imrtls00.projectevo

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class MyAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.packageName == null) return

        // Check if Gmail is the active app
        if (event.packageName == "com.google.android.gm") {
            Log.d("MyAccessibilityService", "Gmail App Opened")

            val rootNode = rootInActiveWindow
            if (rootNode != null) {
                val extractedText = getAllTextFromNode(rootNode)
                Log.d("MyAccessibilityService", "Extracted Gmail Text: $extractedText")

                // Send extracted text to React Native
                sendEventToReactNative(extractedText)
            }
        }
    }

    override fun onInterrupt() {
        Log.d("MyAccessibilityService", "Accessibility Service Interrupted")
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
        }
        serviceInfo = info
        Log.d("MyAccessibilityService", "Accessibility Service Connected")
    }

    private fun getAllTextFromNode(node: AccessibilityNodeInfo?): String {
        if (node == null) return ""

        val texts = mutableListOf<String>()
        if (node.text != null) {
            texts.add(node.text.toString())
        }
        for (i in 0 until node.childCount) {
            texts.add(getAllTextFromNode(node.getChild(i)))
        }
        return texts.joinToString(" ")
    }

    private fun sendEventToReactNative(text: String) {
        val reactContext = MyAccessibilityModule.getReactContext()
    
        if (reactContext != null && reactContext.hasActiveReactInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("ScreenContentExtracted", text)
    
            Log.d("MyAccessibilityService", "ScreenContentExtracted event sent to React Native")
        } else {
            Log.e("MyAccessibilityService", "React Context is null or inactive")
        }
    }    
}
