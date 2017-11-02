package com.brcamobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.jamesisaac.rnbackgroundtask.BackgroundTaskPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;
import android.support.annotation.NonNull;

// stetho
import com.facebook.react.modules.network.ReactCookieJarContainer;
import com.facebook.stetho.Stetho;
import okhttp3.OkHttpClient;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import java.util.concurrent.TimeUnit;

// react-native-fcm
import com.evollu.react.fcm.FIRMessagingPackage;

public class MainApplication extends NavigationApplication {
    // stetho
    public void onCreate() {
        super.onCreate();
        Stetho.initializeWithDefaults(this);
        OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(0, TimeUnit.MILLISECONDS)
            .readTimeout(0, TimeUnit.MILLISECONDS)
            .writeTimeout(0, TimeUnit.MILLISECONDS)
            .cookieJar(new ReactCookieJarContainer())
            .addNetworkInterceptor(new StethoInterceptor())
            .build();
        OkHttpClientProvider.replaceOkHttpClient(client);
        BackgroundTaskPackage.useContext(this);
    }

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new FIRMessagingPackage(),
            new BackgroundTaskPackage()
        );
    }

    @NonNull
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
