import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';

import {useTheme} from '@/app/components/theme-context';
import axiosConfig from '@/app/helper/axios-config';
import {CHAT_API} from '@/app/constants/api-routes';
import {TEST_IDS} from '@/app/constants/test-ids/create-group-screen';

import CustomButton from '@/app/components/custom-button';
import Header from '@/app/components/create-group/header-component';
import SearchBar from '@/app/components/custom-search-bar';
import SelectedUsersList from '../../components/create-group/selected-users-list';
import TabView from '../../components/create-group/tab-view';
import UserList from '../../components/create-group/user-list';
import {
  addCustomersList,
  ConversationRecord,
  ConversationResponse,
  CreateGroupRootState,
  setCustomersList,
  setStaffList,
} from '@/app/store/create-group-slice';
import {capitalizeText} from '@/app/utils/helper-functions';
import {navigateTo} from '@/app/helper/navigation';
import {NAVIGATION_ROUTES} from '@/app/constants/navigation-routes';

const USER_API = {
  CUSTOMERS: 'user/conversations/customers',
  STAFF: 'users/staff',
};

type CreateGroupProps = {
  friendlyName: string;
  uniqueName: string;
  identities: string[];
  phoneNumbers: string[];
};

type CreateGroupResponse = {
  message: string;
  conversationSid: string;
};

type UserSelectionParamList = {
  name: string;
};

const UserSelectionScreen = () => {
  const {activeTheme} = useTheme();

  const dispatch = useDispatch();

  const {customers: customersList, staff: staffList} = useSelector(
    (state: {createGroup: CreateGroupRootState}) => state.createGroup,
  );

  const {name} = useLocalSearchParams<UserSelectionParamList>();

  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<ConversationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'customers' | 'staff'>('staff');

  const fetchUsers = async (type: 'customers' | 'staff') => {
    const endpoint = USER_API[type.toUpperCase() as keyof typeof USER_API];
    const {data} = await axiosConfig.get(endpoint);
    if (type === 'staff') {
      const reFormattedData = data?.records?.map(
        (item: {id: string; name: string; userName: string}) => ({
          participantSid: item?.id,
          conversationFriendlyName: item?.name,
          conversationUserName: item?.userName,
        }),
      );
      return {count: reFormattedData?.length, records: reFormattedData};
    } else {
      return data;
    }
  };

  const {data: customers, isLoading: isLoadingCustomers} =
    useQuery<ConversationResponse>({
      queryKey: ['customers'],
      queryFn: () => fetchUsers('customers'),
    });

  const {data: staff, isLoading: isLoadingStaff} =
    useQuery<ConversationResponse>({
      queryKey: ['staff'],
      queryFn: () => fetchUsers('staff'),
    });

  useEffect(() => {
    if (customers) {
      dispatch(setCustomersList(customers?.records));
    }
    if (staff) {
      dispatch(setStaffList(staff?.records));
    }
  }, [customers, dispatch, staff]);

  const handleUserSelect = (user: ConversationRecord) => {
    setSelectedUsers(prev =>
      prev.some(u => u.participantSid === user.participantSid)
        ? prev.filter(u => u.participantSid !== user.participantSid)
        : [...prev, user],
    );
  };

  const filteredUsers =
    (activeTab === 'customers' ? customersList : staffList)?.filter(
      (user: ConversationRecord) =>
        user?.conversationFriendlyName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    ) || [];

  const handleSearch = ({search}: {search: string}) => {
    setSearchQuery(search);
  };

  const createGroupRequest = useCallback(
    async (params: CreateGroupProps): Promise<CreateGroupResponse> => {
      const {data} = await axiosConfig.post<CreateGroupResponse>(
        CHAT_API.CREATE_GROUP,
        params,
      );
      return data;
    },
    [],
  );

  const CreateGroup: UseMutationResult<
    CreateGroupResponse,
    unknown,
    CreateGroupProps
  > = useMutation({
    mutationFn: createGroupRequest,
    onSuccess: async data => {
      navigateTo(NAVIGATION_ROUTES.CHAT_MESSAGES, {
        id: data?.conversationSid,
        name,
      });
      queryClient.invalidateQueries({queryKey: ['aboutMe']});
      queryClient.invalidateQueries({queryKey: ['chats']});
    },
    onError: error => {
      console.warn(JSON.stringify(error, null, 2));
    },
  });

  const getUserIdentitiesPhoneNumbers = useCallback(() => {
    const identities = [] as string[],
      phoneNumbers = [] as string[];

    selectedUsers?.map((item: ConversationRecord) => {
      if (item?.conversationUserName) {
        identities.push(item?.conversationUserName);
      } else {
        phoneNumbers.push(item?.conversationFriendlyName);
      }
    });

    return {identities, phoneNumbers};
  }, [selectedUsers]);

  const createGroup = useCallback(() => {
    const {identities, phoneNumbers} = getUserIdentitiesPhoneNumbers();
    const body = {
      friendlyName: name,
      uniqueName: name,
      identities,
      phoneNumbers,
    };
    CreateGroup.mutate(body);
  }, [CreateGroup, getUserIdentitiesPhoneNumbers, name]);

  const addToCustomersList = (user: ConversationRecord) => {
    dispatch(addCustomersList(user));
    handleUserSelect(user);
  };

  return (
    <SafeAreaView className={`flex-1 ${activeTheme.background}`}>
      <Header
        groupName={capitalizeText(name)}
        addToCustomersList={addToCustomersList}
      />
      <View className="py-3">
        <SearchBar handleSearch={handleSearch} filter="" />
      </View>
      {selectedUsers?.length > 0 && (
        <View className="h-[120]">
          <SelectedUsersList users={selectedUsers} />
        </View>
      )}
      <TabView activeTab={activeTab} onTabChange={setActiveTab} />
      <UserList
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onUserSelect={handleUserSelect}
        isLoading={
          activeTab === 'customers' ? isLoadingCustomers : isLoadingStaff
        }
        activeTab={activeTab}
      />
      <CustomButton
        title={'create'}
        onPress={createGroup}
        disabled={selectedUsers.length === 0}
        loading={CreateGroup?.isPending}
        testID={TEST_IDS.BUTTON.CREATE_GROUP}
      />
    </SafeAreaView>
  );
};

export default UserSelectionScreen;
