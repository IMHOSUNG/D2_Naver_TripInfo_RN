package com.reactnativetemplate;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.emekalites.react.compress.image.ImageCompressPackage;
import com.imagepicker.ImagePickerPackage;
import com.devialab.camerarollextended.CameraRollExtendedManager;
import com.dooboolab.naverlogin.RNNaverLoginPackage;
import org.reactnative.camera.RNCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerPackage(),
            new ImageCompressPackage(),
            new ImagePickerPackage(),
            new CameraRollExtendedManager(),
            new RNNaverLoginPackage(),
            new RNCameraPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new MapsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
