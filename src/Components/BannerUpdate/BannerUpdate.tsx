import React, {useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, Easing} from 'react-native';
import {useQueryGetVersionApp} from '../../services/Version/useQueryGetVersionApp';
const {width} = Dimensions.get('screen');
export const BannerUpdate = () => {
  const {data, refetch}:any = useQueryGetVersionApp({});
  const [isOldApp, setIsOldApp] = useState(false);
  const version = '1.0.0';
  const opacity = useRef(new Animated.Value(0)).current;
  const position = useRef(new Animated.Value(-width)).current;
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      if (data.versionResolver !== version) {
        setIsOldApp(true);
      }
    }
  }, [data]);
  useEffect(() => {
    if (isOldApp) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start(() =>
        Animated.timing(position, {
          toValue: 0,
          duration: 2000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }).start(),
      );
    }
  }, [isOldApp]);
  return (
    <>
      {isOldApp ? (
        <Animated.View
          style={{
            backgroundColor: '#074169',
            justifyContent: 'center',
            alignItems: 'center',
            opacity,
          }}>
          <Animated.Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
              transform: [{translateX: position}],
            }}>
            Nueva actualizacion disponible, ve a playstore y actualiza para
            tener las ultimas caracteristicas!
          </Animated.Text>
        </Animated.View>
      ) : null}
    </>
  );
};
