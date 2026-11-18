import React, {useRef, useState} from 'react';
import {Box, Center, HStack, Modal, Text, VStack} from 'native-base';
import {PanResponder, TouchableOpacity, View} from 'react-native';
import Svg, {Path, SvgXml} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import Button from '../Button';

const WIDTH = 600;
const HEIGHT = 200;

const toSvg = (paths: string[]) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">${paths
    .map(
      path =>
        `<path d="${path}" fill="none" stroke="#111417" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join('')}</svg>`;

const PAD_STYLE = {
  width: '100%' as const,
  aspectRatio: WIDTH / HEIGHT,
  borderWidth: 1,
  borderStyle: 'dashed' as const,
  borderColor: '#C7CBD1',
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  overflow: 'hidden' as const,
};

// Area where the signer draws with the finger. It is shown in a window of its own,
// so that the scroll of the page never takes over the drawing.
const DrawingArea: React.FC<{onChange: (paths: string[]) => void}> = ({
  onChange,
}) => {
  const {t} = useTranslation();
  const [paths, setPaths] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const size = useRef({width: 1, height: 1});
  const currentPath = useRef('');
  const allPaths = useRef<string[]>([]);

  // Touch positions are converted to the coordinates of the drawing
  const point = (x: number, y: number) =>
    `${Math.round((x * WIDTH) / size.current.width)},${Math.round(
      (y * HEIGHT) / size.current.height,
    )}`;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: event => {
        const {locationX, locationY} = event.nativeEvent;
        currentPath.current = `M${point(locationX, locationY)}`;
        setCurrent(currentPath.current);
      },
      onPanResponderMove: event => {
        const {locationX, locationY} = event.nativeEvent;
        currentPath.current += ` L${point(locationX, locationY)}`;
        setCurrent(currentPath.current);
      },
      onPanResponderRelease: () => {
        allPaths.current = [...allPaths.current, currentPath.current];
        setPaths(allPaths.current);
        setCurrent('');
        onChange(allPaths.current);
      },
    }),
  ).current;

  const clear = () => {
    allPaths.current = [];
    setPaths([]);
    onChange([]);
  };

  return (
    <VStack>
      <View
        {...responder.panHandlers}
        onLayout={event => {
          size.current = {
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          };
        }}
        style={PAD_STYLE}>
        {/* The drawing does not catch the touches, so that positions stay relative to the area */}
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          pointerEvents="none">
          {[...paths, current].filter(Boolean).map((path, index) => (
            <Path
              key={index}
              d={path}
              fill="none"
              stroke="#111417"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      </View>
      <HStack justifyContent="flex-end">
        <Text
          px="8px"
          py="6px"
          fontSize="13px"
          fontWeight={600}
          color="primary.200"
          onPress={clear}>
          {t('classObservation.signatures.clear')}
        </Text>
      </HStack>
    </VStack>
  );
};

type Props = {
  title: string;
  // SVG of the signature already drawn
  value?: string | null;
  onChange: (svg: string | undefined) => void;
};

// Signature with the finger (B17), kept as an SVG image: the box shows the signature,
// a tap opens the drawing window.
const SignaturePad: React.FC<Props> = ({title, value, onChange}) => {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [drawn, setDrawn] = useState<string[]>([]);

  const close = () => {
    setOpen(false);
    setDrawn([]);
  };

  return (
    <Box mt="10px">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t('classObservation.signatures.sign')}
        onPress={() => setOpen(true)}>
        <View style={PAD_STYLE}>
          {value ? (
            <SvgXml xml={value} width="100%" height="100%" />
          ) : (
            <Center flex={1}>
              <Text fontSize="13px" color="gray.400">
                {t('classObservation.signatures.sign-here')}
              </Text>
            </Center>
          )}
        </View>
      </TouchableOpacity>
      {!!value && (
        <HStack justifyContent="flex-end">
          <Text
            px="8px"
            py="4px"
            fontSize="13px"
            fontWeight={600}
            color="primary.200"
            onPress={() => onChange(undefined)}>
            {t('classObservation.signatures.clear')}
          </Text>
        </HStack>
      )}

      <Modal isOpen={open} onClose={close}>
        <VStack w="full" mt="auto" p="16px" bg="white" borderTopRadius="20px">
          <Text mb="12px" fontSize="18px" fontWeight={700} color="gray.700">
            {title}
          </Text>
          <DrawingArea onChange={setDrawn} />
          <HStack mt="8px" space={3}>
            <Button flex={1} mb={0} variant="outlined" onPress={close}>
              {t('common.cancel')}
            </Button>
            <Button
              flex={1}
              mb={0}
              disabled={drawn.length === 0}
              onPress={() => {
                onChange(toSvg(drawn));
                close();
              }}>
              {t('classObservation.signatures.validate')}
            </Button>
          </HStack>
        </VStack>
      </Modal>
    </Box>
  );
};

export default SignaturePad;
