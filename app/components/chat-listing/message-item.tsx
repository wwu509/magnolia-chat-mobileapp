import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import moment from 'moment';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';
import {navigateTo} from '@/app/helper/navigation';
import {Conversation} from '@/app/store/chat-listing-slice';
import UserDefault from '@/assets/images/user_default.jpg';

const MessageItem: React.FC<Conversation> = ({
  conversationSid,
  friendlyName,
  latestMessage,
  attributes,
  conversationType,
  conversationCustomers,
}) => {
  let customerName =
    conversationType === 'one-to-one' && conversationCustomers?.[0]?.first_name
      ? conversationCustomers[0]?.first_name
      : friendlyName;
  return (
    <Pressable
      className="flex flex-row item-center mt-4 w-full border-b border-gray-300 pb-4"
      onPress={() =>
        navigateTo(NAVIGATION_ROUTES.CHAT_MESSAGES, {
          name: customerName,
          id: conversationSid,
          important: `${attributes?.important}`,
        })
      }>
      <View className="w-[88%] flex flex-row text-sm max-w-full mr-[2%]">
        <View className="mr-2 w-[18%]">
          <Image
            accessibilityLabel={`${friendlyName}'s avatar`}
            source={UserDefault}
            className="h-[40px] w-[40px] mx-2 rounded-full shrink-0 self-stretch my-auto w-11 aspect-square"
          />
        </View>
        <View className="w-[82%]">
          <Text className="font-medium text-base text-black/80">
            {customerName}
          </Text>
          {!latestMessage?.media ? (
            <Text className="text-base text-black/50" numberOfLines={1}>
              {latestMessage?.body || 'New conversation started'}
            </Text>
          ) : (
            <View className="">
              {latestMessage?.media?.[0]?.['ContentType']?.includes('image') ? (
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="image"
                    size={20}
                    color="black"
                  />
                  <Text className="ml-2 text-base text-black/50">Image</Text>
                </View>
              ) : (
                latestMessage?.media?.[0]?.['ContentType']?.includes(
                  'video',
                ) && (
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="video"
                      size={20}
                      color="black"
                    />
                    <Text className="ml-2 text-base text-black/50">Video</Text>
                  </View>
                )
              )}
            </View>
          )}
        </View>
      </View>
      <View className="items-center justify-center w-[10%]">
        <View>
          <Text className="text-xs whitespace-nowrap text-black/70">
            {moment(latestMessage?.dateCreated).format('HH:mm')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default MessageItem;
