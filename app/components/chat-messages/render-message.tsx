import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {Image} from 'expo-image';
import {Message} from '@/app/store/chat-messages-slice';
import moment from 'moment';
import HomeLogo from '@/assets/images/home_logo.png';
import UserDefault from '@/assets/images/user_default.jpg';
import PlaySvg from '@/assets/svgs/play-svg';
import AddUserDetails from '@/app/(screens)/chat-messages-screen/AddUserDetails';
import {useSelector} from 'react-redux';
import {RootState} from '@/app/store/global-slice';
import {MaterialCommunityIcons} from '@expo/vector-icons';

type RenderMessageProps = {
  item: Message;
  index: number;
  username: string;
  onMediaPress: (imageUri: string, isImage: boolean) => void;
  mutedUsers: number[];
  refetchMethod: any;
};

const RenderMessage: React.FC<RenderMessageProps> = ({
  item,
  index,
  username,
  onMediaPress,
  mutedUsers,
  refetchMethod,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const isMute = mutedUsers?.includes(item?.user?.id || 0);

  const {user} = useSelector((state: RootState) => state.global);

  const isClient = item?.client || item?.user;

  return (
    <>
      <AddUserDetails
        modalVisible={modalVisible}
        item={item}
        onClose={() => {
          setModalVisible(false);
        }}
        refetchMethod={refetchMethod}
        isUserMute={isMute}
      />
      <Pressable
        onPress={() => {
          if (
            (user?.userRolePermissions?.[0]?.role?.name === 'super_admin' &&
              item?.user?.role?.name === 'agent') ||
            (!item?.client?.firstName &&
              !item?.client?.lastName &&
              !['agent', 'super_admin'].includes(
                item?.user?.role?.name || '',
              ) &&
              !item?.isTwilioGeneratedMessage)
          ) {
            setModalVisible(true);
          }
        }}
        key={`inner-${index}`}
        className={`flex-row ${
          item?.author !== username ? '' : 'flex-row-reverse'
        } my-1.5`}>
        <View className="flex-col-reverse">
          <Image
            className="h-[50px] w-[50px] mx-2 rounded-full"
            alt="profile_image"
            source={
              item?.author === null || /^\+\d{11}$/.test(item?.author || '')
                ? UserDefault
                : HomeLogo
            }
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
            {isMute && (
              <MaterialCommunityIcons
                name="message-off"
                size={15}
                style={{marginRight: 2}}
              />
            )}
          </View>

          <View className="p-2.5">
            {!!isClient && (
              <Text
                className={
                  item?.author !== username ? 'text-black' : 'text-white'
                }>
                {`${isClient?.firstName ? isClient?.firstName + ' ' + isClient?.lastName : '+1' + item?.client?.mobile}`}
              </Text>
            )}
            {!item?.media ? (
              <Text
                className={`${
                  item?.author !== username ? 'text-black' : 'text-white'
                } font-semibold pt-2`}>
                {item?.body}
              </Text>
            ) : (
              <View className="h-[150px] w-[150px] justify-center items-center">
                {item?.media?.[0]?.['ContentType']?.includes('image') ? (
                  <RenderImageMessage
                    onMediaPress={onMediaPress}
                    mediaUrl={item?.mediaUrls ?? ''}
                    isImage={item?.media?.[0]?.['ContentType']?.includes(
                      'image',
                    )}
                  />
                ) : (
                  <Pressable
                    onPress={() =>
                      onMediaPress(
                        item?.mediaUrls || '',
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
      </Pressable>
    </>
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
