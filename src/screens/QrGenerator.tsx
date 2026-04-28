import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import QRCode from "react-native-qrcode-svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";

const QrGenerator = ({ navigation, route }: any) => {
  const [text, setText] = useState("https://example.com");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Text/URL", value: "text" },
    { label: "Wifi", value: "wifi" },
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
    { label: "Facebook", value: "facebook" },
    { label: "Youtube", value: "youtube" },
    
  ]);
  const [number, setNumber] = useState('');
const [sms, setSms] = useState('');
const [email, setEmail] = useState('');

  const title = route?.params?.toolTitle ?? "QR Code Generator";
  const safeValue = useMemo(() => {
    const trimmed = text.trim();
    return trimmed.length ? trimmed : " ";
  }, [text]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-5 mt-5 flex-1">
        <View className="mb-4 h-11 justify-center relative">
          <Pressable
            onPress={() => navigation?.goBack?.()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm z-10"
          >
            <AntDesign name="arrow-left" size={20} color="#0F172A" />
          </Pressable>

          <View className="absolute left-0 right-0 items-center">
            <View className="border bg-white px-5 py-2 rounded-full border-slate-200">
              <Text className="text-xl font-bold text-slate-900">{title}</Text>
            </View>
          </View>
        </View>

        <View className="rounded-[32px] bg-white shadow-lg shadow-blue-500 border border-blue-100 p-6 flex-1">
          <View
            className={`h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 mb-4 self-center ${route?.params?.bgClassName || "bg-blue-50 border-blue-100"}`}
          >
            <MaterialIcons
              name={route?.params?.toolIcon || "qrcode"}
              size={40}
              color={route?.params?.toolColor || "#22C55E"}
            />
          </View>

          <Text className="text-sm text-slate-500 text-center mb-4">
            Type text or link and your QR code updates instantly.
          </Text>
          <View style={{ zIndex: 10, marginVertical: 8 }}>
            <DropDownPicker
            maxHeight={310}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select QR code type"
              containerStyle={{ height: 48 }}
              style={{ backgroundColor: "#fff", borderColor: "#D1D5DB" }}
              dropDownContainerStyle={{
                backgroundColor: "#fff",
                borderStyle: "solid",
                borderRadius: 12,
                borderColor: "#D1D5DB",
              }}
            />
          </View>

          <View className="rounded-2xl shadow-md shadow-blue-500 bg-slate-50 border border-slate-200 p-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Text or URL
            </Text>

            {value === 'sms' && (
            <>
              <TextInput
                placeholder="Enter number"
                value={number}
                onChangeText={setNumber}
                style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
              />
              <TextInput
                placeholder="Enter SMS"
                value={sms}
                onChangeText={setSms}
                style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
              />
            </>
          )}

          {value === 'email' && (
            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
            />
          )}
           {value=="text" && (
             <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Enter text or URL"
              placeholderTextColor="#94A3B8"
              multiline
              className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 min-h-28"
            />
          )
           }
           {value === 'youtube' && (
  <TextInput
    value={text}
    onChangeText={setText}
    placeholder="Enter YouTube URL"
    placeholderTextColor="#94A3B8"
    style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
  />
)}
           </View>
          <View className="mt-5 shadow-md shadow-blue-500 rounded-2xl bg-slate-50 border border-slate-200 p-5 items-center justify-center">
            <QRCode value={safeValue} size={220} color="#0F172A" />
          </View>

          <Pressable
            onPress={() => setText("")}
            className="mt-5 items-center justify-center rounded-full py-4 shadow-md active:opacity-90 bg-slate-700 shadow-slate-400"
          >
            <View className="flex-row items-center">
              <AntDesign name="delete" size={20} color="#FFFFFF" />
              <Text className="ml-3 text-base font-semibold text-white">
                Clear
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QrGenerator;
