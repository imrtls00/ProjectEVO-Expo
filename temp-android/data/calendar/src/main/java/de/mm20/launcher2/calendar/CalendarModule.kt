package de.mm20.launcher2.calendar

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CalendarModule"
    }

    @ReactMethod
    fun getCalendars(promise: Promise) {
        GlobalScope.launch {
            try {
                val calendars = fetchCalendars() // Implement this method to fetch calendars
                promise.resolve(calendars)
            } catch (e: Exception) {
                promise.reject("ERROR", e)
            }
        }
    }

    @ReactMethod
    fun getEvents(from: Long, to: Long, promise: Promise) {
        GlobalScope.launch {
            try {
                val events = fetchEvents(from, to) // Implement this method to fetch events
                promise.resolve(events)
            } catch (e: Exception) {
                promise.reject("ERROR", e)
            }
        }
    }

    private suspend fun fetchCalendars(): List<CalendarList> {
        // Call your CalendarRepository to get the calendars
        return CalendarRepositoryImpl(/* dependencies */).getCalendars().first()
    }

    private suspend fun fetchEvents(from: Long, to: Long): List<CalendarEvent> {
        // Call your CalendarRepository to get the events
        return CalendarRepositoryImpl(/* dependencies */).findMany(from, to, emptyList(), false).first()
    }
} 