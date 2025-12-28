Additional setup for this project

This project was extended to include React Navigation, SVG support, and Redux Toolkit. Follow the steps below after cloning.

- Install JS dependencies (this project used `--legacy-peer-deps` to avoid peer conflicts with React 19):

```bash
npm install --legacy-peer-deps
```

- Metro + SVG: `metro.config.js` is already configured to use `react-native-svg-transformer`. You can import SVGs as components:

```tsx
import Logo from './assets/logo.svg';
<Logo width={120} height={40} />;
```

- Reanimated: add the Reanimated plugin to `babel.config.js` (the plugin should be last in the `plugins` array):

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

- iOS: after adding native deps, run CocoaPods install from the `ios` folder:

```bash
cd ios
bundle install   # if using bundler for CocoaPods
bundle exec pod install
cd ..
```

- Android: clean and rebuild after native installs:

```bash
cd android
./gradlew clean
cd ..
npm run android
```

Notes:

- If you see an `ERESOLVE` npm error about peer dependencies, `--legacy-peer-deps` is an acceptable workaround for React Native projects where peer ranges lag behind the RN React version.
- The project may warn about Node engine version; consider using Node >= 20.19.4 to match React Native's recommended engine.
