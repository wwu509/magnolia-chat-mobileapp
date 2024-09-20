import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Linking,
  Platform,
  ActivityIndicator,
  Pressable,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useDispatch } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import moment from "moment";
// import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "@/app/components/theme-context";
import { TEST_IDS } from "@/app/constants/test-ids/chat-screen";
import { navigateBack } from "@/app/helper/navigation";
import BackSvg from "@/assets/svgs/arrow-left-svg";
// import DocumentPicker, {types} from 'react-native-document-picker';
// import {launchImageLibrary} from 'react-native-image-picker';
// import {chat_text, height_40, IMAGE_URL} from '../../config/Constants';
// import {SendAMessgae, checkTypingStatus} from '../../socket/ChatSockets';
// import KeyboardAccessoryView from '../KeyboardAccessoryView';
// import ImageZoomer from '../ImageZoomer/ImageZoomer';

// Add this type definition at the top of your file
type UserData = {
  id: string;
  profile_picture?: string;
  // Add other properties as needed
};

interface ImageType {
  fileName: string;
  url: string;
  // Add other properties that your image object might have
}

export default function ChatMessagesScreen() {
  const { activeTheme } = useTheme();
  const dispatch = useDispatch();
  const inputAccessoryViewID = "uniqueID";
  const TypeImge = "image";
  const [FileMsg, setFileMsg] = useState<boolean | string>(false);
  const [textMsg, settextMsg] = useState("");
  const [userData, setuserData] = useState<UserData | null>(null);
  //   const [zoomImageData, setzoomImageData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [FileMsgsData] = useState<ImageType | null>(null);
  //   const [zoomImage, setzoomImage] = useState(false);
  const [showPickerModal, setshowPickerModal] = React.useState(false);
  const isFocused = useIsFocused();
  const [keyboardShow, setKeyboardShow] = React.useState(false);
  const [KeyboardHeight, setKeyboardHeight] = React.useState<
    number | undefined
  >(undefined);
  //   const {orderItems, orderChatData, typingStatus, orderId, orderChatCount} =
  //     useSelector((state: RootState) => state.myorders);

  const { orderItems, orderChatData, typingStatus, orderId, orderChatCount } = {
    orderItems: {
      delivered_by: "Alex Johnson",
      deliveryBoy: {
        profile_picture:
          "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
      },
    },
    orderChatData: [
      {
        date: "2023-05-15",
        messages: [
          {
            id: "msg1",
            sender_type: "customer",
            message:
              "Hi, I've placed an order. Can you confirm it's on the way?",
            messageType: "text",
            createdAt: "2023-05-15T09:00:00Z",
            seen: 1,
            sender_id: "customer123",
            status: "received",
          },
          {
            id: "msg2",
            sender_type: "delivery",
            message:
              "Hello! Yes, I've received your order and I'm preparing to leave now.",
            messageType: "text",
            createdAt: "2023-05-15T09:05:00Z",
            seen: 1,
            sender_id: "delivery456",
            status: "send",
          },
          {
            id: "msg3",
            sender_type: "customer",
            message: "Great, thanks! How long do you think it will take?",
            messageType: "text",
            createdAt: "2023-05-15T09:10:00Z",
            seen: 1,
            sender_id: "customer123",
            status: "received",
          },
          {
            id: "msg4",
            sender_type: "delivery",
            message: "I estimate about 20 minutes. I'll keep you updated.",
            messageType: "text",
            createdAt: "2023-05-15T09:12:00Z",
            seen: 1,
            sender_id: "delivery456",
            status: "send",
          },
        ],
      },
      {
        date: "2023-05-16",
        messages: [
          {
            id: "msg5",
            sender_type: "delivery",
            message: "I'm about 5 minutes away. Here's my current location:",
            messageType: "text",
            createdAt: "2023-05-16T14:30:00Z",
            seen: 1,
            sender_id: "delivery456",
            status: "send",
          },
          {
            id: "msg6",
            sender_type: "delivery",
            messageType: "image",
            file_name: "location_map.jpg",
            url: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
            createdAt: "2023-05-16T14:31:00Z",
            seen: 1,
            sender_id: "delivery456",
            status: "received",
          },
          {
            id: "msg7",
            sender_type: "customer",
            message: "Perfect, I see you're close. I'll be ready at the door.",
            messageType: "text",
            createdAt: "2023-05-16T14:33:00Z",
            seen: 1,
            sender_id: "customer123",
            status: "send",
          },
          {
            id: "msg8",
            sender_type: "delivery",
            message: "I've arrived. I'm at the main entrance.",
            messageType: "text",
            createdAt: "2023-05-16T14:38:00Z",
            seen: 1,
            sender_id: "delivery456",
            status: "received",
          },
          {
            id: "msg9",
            sender_type: "customer",
            message: "Got it, coming down now!",
            messageType: "text",
            createdAt: "2023-05-16T14:39:00Z",
            seen: 1,
            sender_id: "customer123",
            status: "send",
          },
          {
            id: "msg10",
            sender_type: "delivery",
            message: "Order delivered successfully. Enjoy your meal!",
            messageType: "text",
            createdAt: "2023-05-16T14:45:00Z",
            seen: 0,
            sender_id: "delivery456",
            status: "received",
          },
        ],
      },
    ],
    typingStatus: false,
    orderId: "ORDER789",
    orderChatCount: 10,
  };

  useEffect(() => {
    userDataset();
  }, []);

  const userDataset = async () => {
    const userData = await AsyncStorage.getItem("user_data");
    if (userData) {
      setuserData(JSON.parse(userData));
    }
  };

  useEffect(() => {
    if (isFocused) {
      setOffset(0);
    } else {
    }
  }, [dispatch, isFocused]);

  useEffect(() => {
    if (textMsg.length <= 0) {
      setFileMsg(false);
    }
  }, [textMsg]);

  //   const handleDocumentSelection = async () => {
  //     try {
  //       const response = await DocumentPicker.pick({
  //         presentationStyle: 'formSheet',
  //         type: [types.pdf],
  //       });
  //       setshowPickerModal(!showPickerModal);
  //       settextMsg(response[0]?.name);
  //       setFileMsg('pdf');
  //       setFileMsgsData(response[0]);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        onKeyboardDidShow(e);
        setKeyboardShow(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardShow(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onKeyboardDidShow = (e: any) => {
    setKeyboardHeight(Math.round(e.endCoordinates.height));
  };

  //   const pickImage = () => {
  //     const options = {
  //       mediaType: 'photo',
  //       includeBase64: true,
  //       maxWidth: 500,
  //       maxHeight: 500,
  //       quality: 0.5,
  //     };
  //     launchImageLibrary(options, async response => {
  //       if (response.didCancel) {
  //         setshowPickerModal(!showPickerModal);
  //       } else if (response.error) {
  //         setshowPickerModal(!showPickerModal);
  //       } else {
  //         if (response.assets[0].fileSize > 5000000) {
  //           alert('Image size is large please pick a smaller size image');
  //         } else {
  //           setshowPickerModal(!showPickerModal);
  //           settextMsg(response.assets[0]?.fileName);
  //           setFileMsg('image');
  //           setFileMsgsData(response.assets[0]);
  //         }
  //       }
  //     });
  //   };

  const sendMsg = () => {
    if (FileMsg === "pdf") {
      //   changetoBAse64(FileMsgsData);
      settextMsg("");
    } else if (FileMsg === "image" && FileMsgsData) {
      sendFileMsgs(FileMsgsData, TypeImge);
      settextMsg("");
    } else {
      if (textMsg.length > 0) {
        sendTextMsg();
        settextMsg("");
      }
    }
  };
  //   const changetoBAse64 = async file => {
  //     const url =
  //       Platform.OS == 'android' ? file.uri : file.uri.replace('file:///', '');
  //     let updatedData = file;
  //     RNFetchBlob.fs.readFile(url, 'base64').then(base64String => {
  //       updatedData['base64'] = base64String;
  //       updatedData['fileName'] = file?.name;
  //       sendFileMsgs(updatedData, TypeFile);
  //     });
  //   };

  const sendFileMsgs = async (image: ImageType, msgsType: string) => {
    if (image) {
      let data = {
        createdAt: "2022-07-21T09:38:51.000Z",
        id: userData?.id ?? "",
        file_name: image?.fileName,
        messageType: msgsType,
        order_id: orderId,
        seen: 2,
        sender_id: userData?.id ?? "",
        sender_type: "customer",
        updatedAt: new Date(),
        url: image?.url,
        status: "send",
      };
      if (orderChatData?.length > 0) {
        orderChatData[orderChatData?.length - 1].messages.push(data);
      }
      setFileMsg("");
      //   const msg = {
      //     message: textMsg,
      //     order_id: orderId,
      //     messageType: msgsType,
      //     receiverId: orderItems?.delivered_by,
      //     file: image,
      //   };
      //   SendAMessgae(msg);
    }
  };
  const sendTextMsg = async () => {
    let data = {
      createdAt: "2022-07-21T09:38:51.000Z",
      id: userData?.id ?? "",
      message: textMsg,
      messageType: "text",
      order_id: orderId,
      seen: 2,
      sender_id: userData?.id ?? "",
      sender_type: "customer",
      updatedAt: new Date(),
      status: "send",
    };
    if (orderChatData.length > 0) {
      orderChatData[orderChatData.length - 1].messages.push(data);
      settextMsg("");
    }
    // let msg = {
    //   message: textMsg,
    //   order_id: orderId,
    //   messageType: 'text',
    //   receiverId: orderItems?.delivered_by,
    // };
    // checkTypingStatus(false, orderId);
    // SendAMessgae(msg);
  };

  const updateTyping = async (text: string) => {
    if (text.length > 0) {
      settextMsg(text);
      //   checkTypingStatus(true, orderId);
    } else {
      settextMsg(text);
      //   checkTypingStatus(false, orderId);
    }
  };

  const paginateChatData = useCallback(async () => {
    if (offset + 10 < orderChatCount) {
      //   await getOrderChat(dispatch, orderId, offset + 10);
      setOffset(offset + 10);
    }
  }, [offset, orderChatCount]);

  const ZoomImage = useCallback((data: boolean, url: string) => {
    // let makeUrl = [{url: url}];
    // setzoomImageData(makeUrl as SetStateAction<never[]>);
    // setzoomImage(data);
  }, []);

  return (
    <SafeAreaView className="h-full mt-5">
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {orderItems ? (
        <>
          {orderItems?.delivered_by == null ? (
            <View className="flex-1 bg-white justify-center items-center p-20">
              <Text className="text-center text-black">{/* chat_text */}</Text>
            </View>
          ) : (
            <View className="h-full">
              <View className="flex-row bg-black justify-between items-center h-[45px] ">
                <Pressable
                  testID={TEST_IDS.BUTTON.BACK_ICON}
                  accessibilityLabel={TEST_IDS.BUTTON.BACK_ICON}
                  onPress={navigateBack}
                  className="w-[10%] h-[100%] justify-center items-center"
                >
                  <BackSvg fill="white" height={20} width={20} />
                </Pressable>
                <Text className="text-center text-white">
                  {"Anonymous Name"}
                </Text>
                <View className="w-[10%]" />
              </View>

              <View className="flex-col-reverse p-2.5 h-[85%]">
                <SafeAreaView className="h-full">
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    inverted
                    data={[...orderChatData].reverse()}
                    keyExtractor={(item, index) => `${item.date}-${index}`}
                    renderItem={({ item, index }) => (
                      <View key={`outer-${index}`}>
                        <View className="justify-center items-center m-5">
                          <Text className="text-black bg-white px-2.5 py-1.5 text-xs rounded-xl">
                            {item.date}
                          </Text>
                        </View>
                        <FlatList
                          nestedScrollEnabled={true}
                          data={item?.messages}
                          keyExtractor={(messages, msgIndex) =>
                            `${messages.id}-${msgIndex}`
                          }
                          renderItem={({ item: message, index: msgIndex }) => (
                            <View
                              key={`inner-${msgIndex}`}
                              className={`flex-row ${
                                message.sender_type !== "customer"
                                  ? ""
                                  : "flex-row-reverse"
                              } my-1.5`}
                            >
                              <View className="flex-col-reverse">
                                <Image
                                  className="h-[50px] w-[50px] mx-2 rounded-full"
                                  alt="profile_image"
                                  source={
                                    message?.sender_type === "customer" &&
                                    userData?.profile_picture
                                      ? {
                                          uri: userData?.profile_picture
                                            ? `${userData.profile_picture}`
                                            : undefined,
                                        }
                                      : message?.sender_type !== "customer" &&
                                          orderItems?.deliveryBoy
                                            ?.profile_picture
                                        ? {
                                            uri: `${orderItems?.deliveryBoy?.profile_picture}`,
                                          }
                                        : {
                                            uri: "https://www.ateamsoftsolutions.com/wp-content/uploads/2020/09/user-dummy.jpg",
                                          }
                                  }
                                />
                              </View>
                              <View
                                className={`${
                                  message.sender_type !== "customer"
                                    ? "bg-white"
                                    : "bg-black"
                                } flex-col-reverse max-w-[75%] rounded-lg`}
                              >
                                <View className="flex-row-reverse px-2.5 mb-[5px]">
                                  {message.sender_type === "customer" && (
                                    <MaterialCommunityIcons
                                      color={
                                        message.seen === 0 ? "white" : "blue"
                                      }
                                      size={16}
                                      style={{ marginLeft: 3 }}
                                      name={
                                        message.status === "send"
                                          ? "check"
                                          : message.status === "received"
                                            ? "check-all"
                                            : "clock-time-five-outline"
                                      }
                                    />
                                  )}
                                  <Text
                                    className={`${
                                      message.sender_type !== "customer"
                                        ? "text-gray-500"
                                        : "text-gray-500"
                                    } text-xs`}
                                  >
                                    {moment(message?.createdAt).format(
                                      "h:mm A"
                                    )}
                                  </Text>
                                </View>

                                <View className="p-2.5">
                                  {message.messageType === "text" && (
                                    <Text
                                      className={`${
                                        message.sender_type !== "customer"
                                          ? "text-black"
                                          : "text-white"
                                      } font-semibold`}
                                    >
                                      {message?.message}
                                    </Text>
                                  )}
                                  {message.messageType === "image" && (
                                    <TouchableOpacity
                                      onPress={() =>
                                        message.url &&
                                        ZoomImage(true, message.url)
                                      }
                                      className="flex-row items-center"
                                    >
                                      <Image
                                        alt="Shared Image"
                                        className="h-[100px] w-[100px]"
                                        source={{ uri: message.url }}
                                      />
                                    </TouchableOpacity>
                                  )}
                                  {message.messageType === "file" && (
                                    <Text
                                      onPress={() =>
                                        message.url &&
                                        Linking.openURL(message.url)
                                      }
                                      className="text-blue-500 underline"
                                    >
                                      {message.file_name || "Download File"}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          )}
                        />
                      </View>
                    )}
                    onEndReached={paginateChatData}
                    onEndReachedThreshold={0.2}
                  />
                </SafeAreaView>
              </View>
              {typingStatus && (
                <Text className="m-2.5 px-5 text-sm">typing...</Text>
              )}
              {showPickerModal && (
                <View className="justify-around flex-row bg-white border-b border-gray-300 py-2.5">
                  <Pressable>
                    <View className="h-10 w-10 rounded-full bg-icon-color justify-center items-center p-2.5">
                      <FontAwesome color={"white"} size={18} name={"image"} />
                    </View>
                    <Text className="text-center text-gray-500">Image</Text>
                  </Pressable>
                  <Pressable>
                    <View className="h-10 w-10 rounded-full bg-icon-color justify-center items-center p-2.5">
                      <FontAwesome
                        color={"white"}
                        size={18}
                        name={"file-pdf-o"}
                      />
                    </View>
                    <Text className="text-center text-gray-500">Pdf</Text>
                  </Pressable>
                </View>
              )}
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                className={`bg-stone-200 py-1 ${
                  Platform.OS === "ios"
                    ? keyboardShow && `mb-[${(KeyboardHeight ?? 0) - 97}px]`
                    : ""
                }`}
              >
                <View className="w-full justify-between flex-row items-center">
                  <View className="w-[90%] flex-row items-center">
                    <Entypo
                      onPress={() => setshowPickerModal(!showPickerModal)}
                      color={"gray"}
                      size={22}
                      className="mx-2.5"
                      style={{ width: "10%", marginLeft: 15 }}
                      name={"attachment"}
                    />
                    <TextInput
                      inputAccessoryViewID={inputAccessoryViewID}
                      placeholder="Type a message..."
                      placeholderTextColor={"gray"}
                      multiline={true}
                      value={
                        typeof FileMsg === "string" && FileMsg === "image"
                          ? textMsg.substring(25)
                          : textMsg
                      }
                      onChangeText={(text) => updateTyping(text)}
                      className="bg-white text-base w-[85%] text-black rounded-lg h-[40px] pl-2"
                    />
                  </View>
                  <MaterialCommunityIcons
                    color={activeTheme.linkContainer}
                    size={25}
                    className="mx-2.5 p-1.5"
                    style={{ width: "6%", marginRight: 10 }}
                    name={"send"}
                    onPress={() => sendMsg()}
                  />
                </View>
              </KeyboardAwareScrollView>
            </View>
          )}
        </>
      ) : (
        <View className="justify-center flex-1">
          <ActivityIndicator
            color={"#c90000"}
            size="large"
            className="h-10 self-center"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
