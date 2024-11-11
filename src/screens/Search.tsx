import {useEffect, useState} from 'react';
import {Stack, Input, Spinner, Icon, Text, Center} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from "@tanstack/react-query";
import { fetchPokemon, Pokemon } from '../utils/api';
import { MainStackScreenProps } from '../navigators/types';

export function Search({navigation}: MainStackScreenProps<'Search'>) {
  const [text, settext] = useState('');
  const { data, fetchStatus, error } = useQuery<Pokemon, Error>({
    queryKey: ['pokemon', text],
    queryFn: () => fetchPokemon(text.toLocaleLowerCase()),
    enabled: !!text,
  });
  useEffect(() => {
    if (data) {
      navigation.replace('Detail', {name: data.name})
    }
  }, [data, navigation])
  return (
    <Stack flex={1} p="4">
      <Input
        placeholder="Buscar Pokémon por nombre o numero"
        backgroundColor="white"
        rounded="xl"
        py="3"
        px="1"
        fontSize="14"
        returnKeyType="search"
        onSubmitEditing={({ nativeEvent }) => settext(nativeEvent.text)}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="search" />}
            size={5}
            ml="2"
            color="gray.400"
          />
        }
      />
      <Center flex={1}>
        {!!error && (
          <Text fontSize="xl" color="gray.500">
              No hay resultados para {text}
          </Text>
        )}
        {fetchStatus ==='fetching' && <Spinner size="lg"/>}
      </Center>
    </Stack>
  );
}
