import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import SearchBar from '@/app/components/custom-search-bar';
import SortBy from '@/app/components/chat-listing/sort-by';
import MessageItem from '@/app/components/chat-listing/message-item';
import {SafeAreaView} from 'react-native-safe-area-context';
import axiosConfig from '@/app/helper/axios-config';
import {CHAT_API} from '@/app/constants/api-routes';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {
  setChatList,
  ChatListResponse,
  Conversation,
} from '@/app/store/chat-listing-slice';
import {useTheme} from '@/app/components/theme-context';
import BackButtonWithTitle from '@/app/components/header/back-button';

const MessageList: React.FC = () => {
  const {activeTheme} = useTheme();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string>('');

  const getChatListing = useCallback(
    async (
      search: string,
      filter: string,
      paseSize: number,
      pageNum: number,
    ) => {
      const {data} = await axiosConfig.get(
        `${CHAT_API.GET_CHAT_LIST}?search=${search}&filter=${filter}&pageSize=${paseSize}page=${pageNum}`,
      );
      return data;
    },
    [],
  );

  const {
    data: chatListing,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<ChatListResponse>({
    queryKey: ['chats', searchText, filter, 5],
    queryFn: ({pageParam, queryKey}) =>
      getChatListing(
        queryKey?.[1] as string,
        queryKey?.[2] as string,
        queryKey?.[3] as number,
        pageParam as number,
      ),
    getNextPageParam: (lastPage: any) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (chatListing) {
      const allRecords = chatListing.pages.flatMap(page => page.records);
      dispatch(setChatList({records: allRecords, count: allRecords?.length}));
    }
  }, [chatListing, dispatch]);

  const handleSearchFilter = useCallback(
    (params: {filter: string; search: string}) => {
      setSearchText(params?.search);
      setFilter(params?.filter);
    },
    [],
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = useCallback(
    ({item}: {item: Conversation}) => <MessageItem {...item} />,
    [],
  );

  const listData = useMemo(() => {
    return chatListing?.pages.flatMap(page => page.records) || [];
  }, [chatListing]);

  const keyExtractor = useCallback(
    (item: Conversation, index: number) =>
      item.conversationSid + index.toString(),
    [],
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-2">
        <ActivityIndicator size="small" color={activeTheme.linkContainer} />
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full rounded-none w-full bg-white m-auto">
      <BackButtonWithTitle title="Messages" />
      <View className="px-4 mt-4">
        <SearchBar handleSearch={handleSearchFilter} filter={filter} />
        <SortBy handleSearch={handleSearchFilter} search={searchText} />
        {isLoading ? (
          <View className="flex-col-reverse p-2.5 h-[85%] justify-center items-center">
            <ActivityIndicator size="large" color={activeTheme.linkContainer} />
          </View>
        ) : listData?.length === 0 ? (
          <View className="flex-col-reverse p-2.5 h-[75%] justify-center items-center">
            <Text className="text-center text-base text-gray-600 w-2/3">
              You currently don't have any chats. Start a conversation now!
            </Text>
          </View>
        ) : (
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            className="w-full h-full"
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
            onRefresh={refetch}
            refreshing={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default MessageList;
