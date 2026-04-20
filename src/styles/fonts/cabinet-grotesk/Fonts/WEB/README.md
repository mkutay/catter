# Installing Webfonts
Follow these simple Steps.

## 1.
Put `cabinet-grotesk/` Folder into a Folder called `fonts/`.

## 2.
Put `cabinet-grotesk.css` into your `css/` Folder.

## 3. (Optional)
You may adapt the `url('path')` in `cabinet-grotesk.css` depends on your Website Filesystem.

## 4.
Import `cabinet-grotesk.css` at the top of you main Stylesheet.

```
@import url('cabinet-grotesk.css');
```

## 5.
You are now ready to use the following Rules in your CSS to specify each Font Style:
```
font-family: CabinetGrotesk-Thin;
font-family: CabinetGrotesk-Extralight;
font-family: CabinetGrotesk-Light;
font-family: CabinetGrotesk-Regular;
font-family: CabinetGrotesk-Medium;
font-family: CabinetGrotesk-Bold;
font-family: CabinetGrotesk-Extrabold;
font-family: CabinetGrotesk-Black;
font-family: CabinetGrotesk-Variable;

```
## 6. (Optional)
Use `font-variation-settings` rule to controll axes of variable fonts:
wght 900.0

Available axes:
'wght' (range from 100.0 to 900.0

