import {MainStackScreenProps} from '../navigators/types';
import {fetchFn, fetchPokemon, Pokemon, Species} from '../utils/api';
import {useQuery} from '@tanstack/react-query';
import {
  AspectRatio,
  Image,
  Text,
  Heading,
  Stack,
  HStack,
  Center,
  Skeleton,
  Spinner,
  Box,
  ScrollView,
  Progress,
} from 'native-base';
import {
  formatNumber,
  getTypeColor,
  removeEscapeCharacters,
} from '../utils/helpers';

export function Detail({ route }: MainStackScreenProps<'Detail'>) {
  const { name } = route.params;

  // Fetch Pokémon data
  const { data, isLoading } = useQuery<Pokemon, Error>({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemon(name),
  });

  // Fetch Pokémon species data
  const { isLoading: isSpeciesLoading, data: species } = useQuery<Species, Error>(
    {
      queryKey: ['species', name],
      queryFn: () => fetchFn(data?.species.url || ''),
      enabled: !!data,
    }
  );

  if (isLoading || !data)
    return (
      <Center flex={1} bg="white">
        <Spinner size="lg" color="black" />
      </Center>
    );

  // Filtrar la descripción en español
  const spanishDescription = species?.flavor_text_entries.find(
    (entry) => entry.language.name === 'es'
  )?.flavor_text;

  return (
    <ScrollView>
      <Stack>
        <Center
          safeArea
          backgroundColor={getTypeColor(data.types[0].type.name) + '.500'}>
          <AspectRatio ratio={1} width="80%">
            <Image
              source={{
                uri: data.sprites.other['official-artwork'].front_default,
              }}
              alt={name}
            />
          </AspectRatio>
          <HStack
            justifyContent="space-between"
            width="100%"
            p="3"
            alignItems="center"
            position="absolute"
            bottom={0}
            left={0}
            right={0}>
            <Heading color="white" textTransform="capitalize" size="2xl">
              {name}
            </Heading>
            <Heading color="white">#{formatNumber(data.id)}</Heading>
          </HStack>
        </Center>

        <Stack p="3">
          <HStack justifyContent="center" space={3}>
            {data.types.map((type) => (
              <Center
                key={type.type.name}
                backgroundColor={getTypeColor(type.type.name) + '.500'}
                rounded="full"
                p="1"
                minW="32"
                _text={{
                  color: 'white',
                  fontSize: 'lg',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}>
                {type.type.name}
              </Center>
            ))}
          </HStack>

          <Center mt="4">
            {isSpeciesLoading && <Skeleton.Text />}
            {!!spanishDescription && (
              <Text fontSize="xl" mt="4" px="4">
                {removeEscapeCharacters(spanishDescription)}
              </Text>
            )}
          </Center>

          <Box mt="6" px="4">
            <Heading fontSize="lg" mb="2">
              Estadísticas
            </Heading>
            {data.stats.map((stat) => {
              // Convertir o redondear el valor a un número entero
              const progressValue = stat.base_stat > 100 ? 100 : Math.round(stat.base_stat);
              return (
                <HStack key={stat.stat.name} justifyContent="space-between" alignItems="center" mb="2">
                  {/* Estadística */}
                  <Text flex={1}>{stat.stat.name}</Text>
                  {/* Barra de progreso */}
                  <Box flex={2} px="2">
                    <Progress
                      value={progressValue}
                      size="sm"
                      colorScheme="success"
                      width="100%"
                      rounded="full"
                    />
                  </Box>
                  {/* Número de la estadística */}
                  <Text>{stat.base_stat}</Text>
                </HStack>
              );
            })}
          </Box>

          <Box mt="6" px="4">
            <Heading fontSize="lg" mb="6">
              Movimientos
            </Heading>
            <HStack flexWrap="wrap" space={2} mb="6">
              {data.moves.slice(0, 10).map((move) => (
                <Center
                  mb="2"
                  key={move.move.name}
                  backgroundColor="gray.200"
                  p="2"
                  rounded="full"
                  _text={{ fontSize: 'sm', fontWeight: 'bold' }}>
                  {move.move.name}
                </Center>
              ))}
            </HStack>
          </Box>
        </Stack>
      </Stack>
    </ScrollView>
  );
}