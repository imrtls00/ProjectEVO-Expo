package de.mm20.launcher2.calendar

import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager

class MainApplication : Application(), ReactApplication {
    // Other methods...

    override fun getPackages(): List<ReactPackage> {
        return listOf(
            MainReactPackage(),
            CalendarPackage() // Register your CalendarModule here
        )
    }
} 