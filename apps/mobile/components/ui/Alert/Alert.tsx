import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import { useAugmentedRef } from "@rn-primitives/hooks";
import * as React from "react";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  useAnimatedStyle,
} from "react-native-reanimated";

import { AlertProps, AlertRef } from "./types";

import { Text } from "../Text";
import { useTheme } from "../../theme/ThemeContext";
import { Button } from "../Button";
import { TextField } from "../TextField";
import { TextFieldRef } from "../TextField/types";
import { cn } from "../../lib/utils";
import { SymbolView } from "expo-symbols";
import { AnimatedView, View } from "../interop";

const Alert = React.forwardRef<AlertRef, AlertProps>(
  (
    {
      children,
      title: titleProp,
      message: messageProp,
      buttons: buttonsProp,
      prompt: promptProp,
      icon: iconProp,
      materialWidth: materialWidthProp,
      materialPortalHost,
    },
    ref
  ) => {
    const { height } = useReanimatedKeyboardAnimation();
    const [open, setOpen] = React.useState(false);
    const [{ title, message, buttons, prompt, icon, materialWidth }, setProps] =
      React.useState<AlertProps>({
        title: titleProp,
        message: messageProp,
        buttons: buttonsProp,
        prompt: promptProp,
        icon: iconProp,
        materialWidth: materialWidthProp,
      });
    const [text, setText] = React.useState(promptProp?.defaultValue ?? "");
    const [password, setPassword] = React.useState("");
    const { colors } = useTheme();
    const passwordRef = React.useRef<TextFieldRef>(null);
    const augmentedRef = useAugmentedRef({
      ref,
      methods: {
        show: () => {
          setOpen(true);
        },
        alert,
        prompt: promptAlert,
      },
    });

    const bottomPaddingStyle = useAnimatedStyle(() => {
      return {
        paddingBottom: height.value * -1,
      };
    });

    function promptAlert(
      args: AlertProps & { prompt: Required<AlertProps["prompt"]> }
    ) {
      setText(args.prompt?.defaultValue ?? "");
      setPassword("");
      setProps(args);
      setOpen(true);
    }

    function alert(args: AlertProps) {
      setText(args.prompt?.defaultValue ?? "");
      setPassword("");
      setProps(args);
      setOpen(true);
    }

    function onOpenChange(open: boolean) {
      if (!open) {
        setText(prompt?.defaultValue ?? "");
        setPassword("");
      }
      setOpen(open);
    }

    return (
      <AlertDialogPrimitive.Root
        ref={augmentedRef}
        open={open}
        onOpenChange={onOpenChange}
      >
        <AlertDialogPrimitive.Trigger asChild={!!children}>
          {children}
        </AlertDialogPrimitive.Trigger>
        <AlertDialogPrimitive.Portal hostName={materialPortalHost}>
          <AlertDialogPrimitive.Overlay asChild>
            <AnimatedView
              entering={FadeIn}
              exiting={FadeOut}
              style={bottomPaddingStyle}
              className={cn(
                "bg-popover/80 absolute bottom-0 left-0 right-0 top-0 items-center justify-center px-3"
              )}
            >
              <AlertDialogPrimitive.Content>
                <AnimatedView
                  style={
                    typeof materialWidth === "number"
                      ? { width: materialWidth }
                      : undefined
                  }
                  entering={FadeInDown}
                  exiting={FadeOutDown}
                  className="bg-card min-w-72 max-w-xl rounded-3xl p-6 pt-7 shadow-xl"
                >
                  {!!icon && (
                    <View className="items-center pb-4">
                      <SymbolView
                        tintColor={colors.foreground}
                        size={27}
                        {...icon}
                      />
                    </View>
                  )}
                  {!!message ? (
                    <>
                      <AlertDialogPrimitive.Title asChild>
                        <Text
                          variant="title2"
                          className={cn(!!icon && "text-center", "pb-4")}
                        >
                          {title}
                        </Text>
                      </AlertDialogPrimitive.Title>
                      <AlertDialogPrimitive.Description asChild>
                        <Text variant="subhead" className="pb-4 opacity-90">
                          {message}
                        </Text>
                      </AlertDialogPrimitive.Description>
                    </>
                  ) : !!icon ? (
                    <AlertDialogPrimitive.Title asChild>
                      <Text
                        variant="title2"
                        className={cn(!!icon && "text-center", "pb-4")}
                      >
                        {title}
                      </Text>
                    </AlertDialogPrimitive.Title>
                  ) : (
                    <AlertDialogPrimitive.Title asChild>
                      <Text variant="subhead" className="pb-4 opacity-90">
                        {title}
                      </Text>
                    </AlertDialogPrimitive.Title>
                  )}
                  {!!prompt ? (
                    <View className="gap-4 pb-8">
                      <TextField
                        autoFocus
                        labelClassName="bg-card"
                        keyboardType={
                          prompt.type === "secure-text"
                            ? "default"
                            : prompt.keyboardType
                        }
                        label={prompt.type === "login-password" ? "Email" : ""}
                        secureTextEntry={prompt.type === "secure-text"}
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={() => {
                          if (
                            prompt.type === "login-password" &&
                            passwordRef.current
                          ) {
                            passwordRef.current.focus();
                            return;
                          }
                          for (const button of buttons) {
                            if (!button.style || button.style === "default") {
                              button.onPress?.(text);
                            }
                          }
                          onOpenChange(false);
                        }}
                        blurOnSubmit={prompt.type !== "login-password"}
                      />
                      {prompt.type === "login-password" && (
                        <TextField
                          ref={passwordRef}
                          labelClassName="bg-card"
                          keyboardType={prompt.keyboardType}
                          defaultValue={prompt.defaultValue}
                          label="Password"
                          secureTextEntry={prompt.type === "login-password"}
                          value={password}
                          onChangeText={setPassword}
                          onSubmitEditing={() => {
                            for (const button of buttons) {
                              if (!button.style || button.style === "default") {
                                button.onPress?.(text);
                              }
                            }
                            onOpenChange(false);
                          }}
                        />
                      )}
                    </View>
                  ) : (
                    <View className="h-0.5" />
                  )}
                  <View
                    className={cn(
                      "flex-row items-center justify-end gap-0.5",
                      buttons.length > 2 && "justify-between"
                    )}
                  >
                    {buttons.map((button, index) => {
                      if (button.style === "cancel") {
                        return (
                          <View
                            key={`${button.text}-${index}`}
                            className={cn(
                              buttons.length > 2 &&
                                index === 0 &&
                                "flex-1 items-start"
                            )}
                          >
                            <AlertDialogPrimitive.Cancel asChild>
                              <Button
                                variant="plain"
                                onPress={() => {
                                  button.onPress?.(
                                    prompt?.type === "login-password"
                                      ? { login: text, password }
                                      : text
                                  );
                                }}
                              >
                                <Text className="text-primary text-[14px]  font-medium">
                                  {button.text}
                                </Text>
                              </Button>
                            </AlertDialogPrimitive.Cancel>
                          </View>
                        );
                      }
                      if (button.style === "destructive") {
                        return (
                          <View
                            key={`${button.text}-${index}`}
                            className={cn(
                              buttons.length > 2 &&
                                index === 0 &&
                                "flex-1 items-start"
                            )}
                          >
                            <AlertDialogPrimitive.Action asChild>
                              <Button
                                variant="tonal"
                                className="bg-destructive/10 dark:bg-destructive/25"
                                onPress={() => {
                                  button.onPress?.(
                                    prompt?.type === "login-password"
                                      ? { login: text, password }
                                      : text
                                  );
                                }}
                              >
                                <Text className="text-foreground text-[14px] font-medium">
                                  {button.text}
                                </Text>
                              </Button>
                            </AlertDialogPrimitive.Action>
                          </View>
                        );
                      }
                      return (
                        <View
                          key={`${button.text}-${index}`}
                          className={cn(
                            buttons.length > 2 &&
                              index === 0 &&
                              "flex-1 items-start"
                          )}
                        >
                          <AlertDialogPrimitive.Action asChild>
                            <Button
                              variant="plain"
                              onPress={() => {
                                button.onPress?.(
                                  prompt?.type === "login-password"
                                    ? { login: text, password }
                                    : text
                                );
                              }}
                            >
                              <Text className="text-primary text-[14px]  font-medium">
                                {button.text}
                              </Text>
                            </Button>
                          </AlertDialogPrimitive.Action>
                        </View>
                      );
                    })}
                  </View>
                </AnimatedView>
              </AlertDialogPrimitive.Content>
            </AnimatedView>
          </AlertDialogPrimitive.Overlay>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    );
  }
);

Alert.displayName = "Alert";

const AlertAnchor = React.forwardRef<AlertRef>((_, ref) => {
  return <Alert ref={ref} title="" buttons={[]} />;
});

export { Alert, AlertAnchor };
