import {useInfiniteQuery} from '@tanstack/react-query';
import {PokemonCard} from '../components/PokemonCard';
import {fetchAllPokemon, AllPokemon} from '../utils/api';
import {Center, Spinner, FlatList} from 'native-base';
import { Text } from 'react-native';

export function Home() {
  const {data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage} =
    useInfiniteQuery<AllPokemon>({
      queryKey: ['pokemons'],
      queryFn: ({pageParam = 'https://pokeapi.co/api/v2/pokemon/'}) =>
        fetchAllPokemon({pageParam}),
      getNextPageParam: lastPage => lastPage.next || undefined,
      initialPageParam: 'https://pokeapi.co/api/v2/pokemon/',
    });

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading)
    return (
      <Center flex={1}>
        <Spinner size="lg" color="black"></Spinner>
      </Center>
    );
  if (!data) return null;

  return (
    <FlatList
      data={data.pages.flatMap(page => page.results)}
      keyExtractor={item => item.name}
      renderItem={({item}) => <PokemonCard name={item.name} />}
      onEndReached={loadMore}
      numColumns={2}
      contentInsetAdjustmentBehavior="automatic"
      ListEmptyComponent={() => <Text>Lista vacia</Text>}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner mt="4" size="lg" color="black" /> : null
      }
      _contentContainerStyle={{
        p: 2,
        bg: 'white',
      }}
    />
  );
}
