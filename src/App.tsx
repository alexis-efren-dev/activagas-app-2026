import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback, useState, useRef, useEffect} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {IconButton, Title} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {useQueryGetColors} from './services/Configurations/useQueryGetColors';
import {IStore} from './redux/store';
import {
  updateGeneralConfigurations,
  updateGeneralConfigurationsImage,
} from './redux/states/generalConfigurationsState';
import App from './HandlerApp';
const {width} = Dimensions.get('screen');

const LoadingScreen: React.FC = (): JSX.Element => {
  const loggedUser = useSelector((store: IStore) => store.loggedUser);

  const dispatch = useDispatch();
  const [idSession, setIdSession] = useState<any>('');
  const [imageUrl, setImageUrl] = useState<any>(undefined);
  const [handlerRefetch, setHandlerRefetch] = useState<any>(false);
  const [defaultBackground, setDefaultBackground] = useState<any>({
    back: '#264052',
    activate: false,
  });

  const checkImage = useCallback(
    (url: any) => {
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.send();
      request.onload = function () {
        if (request.status === 200) {
          // Si la solicitud fue exitosa
          setImageUrl(url);
        } else {
          // Si ocurrió un error
          setImageUrl(
            'https://activagas-files.s3.amazonaws.com/initialimage.png',
          );
        }
      };
    },
    [setImageUrl], // Dependencias
  );
  const getSessionInfo = useCallback(
    async (id: any = false) => {
      let getIdSession = id;
      if (!getIdSession) {
        getIdSession = await AsyncStorage.getItem('look');
      }
      if (getIdSession) {
        setIdSession(getIdSession);
        const lulic = `https://activagas-files.s3.amazonaws.com/${getIdSession}.png`;
        checkImage(lulic);
      } else {
        setImageUrl(
          'https://activagas-files.s3.amazonaws.com/initialimage.png',
        );
        setIdSession(undefined);
      }
    },
    [checkImage],
  );

  const {data, isError, refetch, isLoading, isFetching, isFetched}: any =
    useQueryGetColors({
      idGas: idSession,
    });
  const [handlerScreens, setHandlerScreens] = useState<any>(false);
  const [gradientColors, setGradientColors] = useState([
    '#323F48',
    '#074169',
    '#019CDE',
  ]);

  const scrollY = useRef<any>(new Animated.Value(1)).current;
  useEffect(() => {
    getSessionInfo();
  }, [getSessionInfo]);

  useEffect(() => {
    if (idSession && idSession !== '') {
      refetch();
    } else if (idSession === undefined) {
      setHandlerRefetch(true);
    }
  }, [idSession, refetch]);

  useEffect(() => {
    if (isFetched) {
      setHandlerRefetch(true);
    }
  }, [isFetched]);

  useEffect(() => {
    if (handlerRefetch && !data) {
      setDefaultBackground({...defaultBackground, activate: true});
    }
    if (data) {
      if (data.getGeneralColorsResolver.backgroundColor.length <= 1) {
        const newArrayColors = [
          data.getGeneralColorsResolver.backgroundColor[0],
          data.getGeneralColorsResolver.backgroundColor[0],
        ];
        setGradientColors(newArrayColors);
        dispatch(
          updateGeneralConfigurations({
            colorFonts: data.getGeneralColorsResolver.colorText,
            gradients: newArrayColors,
            imageUrl,
          }),
        );
      } else {
        setGradientColors(data.getGeneralColorsResolver.backgroundColor);
        dispatch(
          updateGeneralConfigurations({
            colorFonts: data.getGeneralColorsResolver.colorText,
            gradients: data.getGeneralColorsResolver.backgroundColor,
            imageUrl,
          }),
        );
      }
    } else {
      dispatch(
        updateGeneralConfigurations({
          colorFonts: '#ffffff',
          gradients: gradientColors,
          imageUrl,
        }),
      );
    }
  }, [handlerRefetch, data]);

useEffect(() => {
    if ((data || defaultBackground.activate) && handlerRefetch) {
      Animated.timing(scrollY, {
        toValue: 0.5,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        setHandlerScreens(true);
      });
    }
  }, [data, handlerRefetch, defaultBackground.activate, scrollY]);

  useEffect(() => {
    if (imageUrl) {
      dispatch(updateGeneralConfigurationsImage(imageUrl));
    }
  }, [imageUrl, dispatch]);

  useEffect(() => {
    if (loggedUser.idGas !== '' && loggedUser.idGas) {
      getSessionInfo(loggedUser.idGas);
    } else {
      getSessionInfo();
    }
  }, [loggedUser, getSessionInfo]);

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <IconButton icon="water-boiler-alert" iconColor={'black'} size={80} />
        <Title>Error de servidor, intentalo mas tarde</Title>
      </View>
    );
  }

  if (isLoading || isFetching) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={true} color={'blue'} />
      </View>
    );
  }

  if (handlerScreens) {
    return <App/>;
  }

  return (
    <>
      {imageUrl !== undefined && (data || defaultBackground.activate) ? (
        <View style={{flex: 1}}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                justifyContent: 'center',
                alignItems: 'center',
                opacity: scrollY,
              },
            ]}>
            <LinearGradient
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              colors={
                data ? gradientColors : ['#323F48', '#074169', '#019CDE']
              }>
              <Image
                source={{
                  //uri:'https://activagasbeta-files.s3.amazonaws.com/Negro.png'}
                  uri: imageUrl,
                }}
                style={{
                  width,
                  height: 150,
                  resizeMode: 'contain',
                }}
              />
            </LinearGradient>
          </Animated.View>
          <View />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};
export default LoadingScreen;
