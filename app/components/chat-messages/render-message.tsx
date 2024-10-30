import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';
import {Message} from '@/app/store/chat-messages-slice';
import moment from 'moment';
import HomeLogo from '@/assets/images/home_logo.png';
import UserDefault from '@/assets/images/user_default.jpg';
import PlaySvg from '@/assets/svgs/play-svg';

type RenderMessageProps = {
  item: Message;
  index: number;
  username: string;
  onMediaPress: (imageUri: string, isImage: boolean) => void;
};

const RenderMessage: React.FC<RenderMessageProps> = ({
  item,
  index,
  username,
  onMediaPress,
}) => {
  return (
    <View
      key={`inner-${index}`}
      className={`flex-row ${
        item?.author !== username ? '' : 'flex-row-reverse'
      } my-1.5`}>
      <View className="flex-col-reverse">
        <Image
          className="h-[50px] w-[50px] mx-2 rounded-full"
          alt="profile_image"
          source={item?.author === username ? HomeLogo : UserDefault}
        />
      </View>
      <View
        className={`${
          item?.author !== username ? 'bg-white' : 'bg-black'
        } flex-col-reverse max-w-[75%] rounded-lg`}>
        <View className="flex-row-reverse px-2.5 mb-[5px]">
          <Text className={`${'text-gray-500'} text-xs`}>
            {moment(item?.dateCreated).format('h:mm A')}
          </Text>
        </View>

        <View className="p-2.5">
          {!item?.media ? (
            <Text
              className={`${
                item?.author !== username ? 'text-black' : 'text-white'
              } font-semibold`}>
              {item?.body}
            </Text>
          ) : (
            <View className="h-[150px] w-[150px] justify-center items-center">
              {item?.media?.[0]?.['ContentType']?.includes('image') ? (
                <RenderImageMessage
                  onMediaPress={onMediaPress}
                  mediaUrl={item?.mediaUrls?.[0] ?? ''}
                  isImage={item?.media?.[0]?.['ContentType']?.includes('image')}
                />
              ) : (
                <Pressable
                  onPress={() =>
                    onMediaPress(
                      item?.mediaUrls?.[0] || '',
                      item?.media?.[0]?.['ContentType']?.includes('image'),
                    )
                  }
                  className="h-[150px] w-[150px] object-contain bg-black justify-center items-center rounded">
                  <PlaySvg fill="white" height={24} width={24} />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default RenderMessage;

const RenderImageMessage = ({
  onMediaPress,
  mediaUrl,
  isImage,
}: {
  onMediaPress: (imageUri: string, isImage: boolean) => void;
  mediaUrl: string;
  isImage: boolean;
}) => {
  return (
    <Pressable onPress={() => onMediaPress(mediaUrl, isImage)}>
      <Image
        alt="Shared Image"
        className="h-[150px] w-[150px] object-contain rounded bg-gray-200"
        source={mediaUrl}
      />
    </Pressable>
  );
};
