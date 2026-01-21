import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

const TabBarIcon = (icon: string) => {
  return (
    <IconButton
      icon={icon}
      iconColor="black"
      size={55}
      style={styles.tabBarIcon}
    />
  );
};

export default TabBarIcon;

const styles = StyleSheet.create({
  tabBarIcon: {top: 25},
});
