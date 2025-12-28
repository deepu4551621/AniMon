import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const showCToast = ({
  type = 'info',
  text1 = '',
  text2 = '',
  duration = 2500,
}: {
  type?: 'success' | 'error' | 'info' | string;
  text1?: string;
  text2?: string;
  duration?: number;
}) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'top',
    visibilityTime: duration,
    autoHide: true,
    topOffset: 50,
  });
};

const toastConfig = {
  success: (props: any) => (
    <View style={[styles.toastContainer, { borderLeftColor: '#2ecc71' }]}>
      <View style={styles.iconWrap}>
        <Icon name="check-circle" size={26} color="#2ecc71" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.text1}>{props.text1 ?? ''}</Text>
        {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
      </View>
    </View>
  ),
  error: (props: any) => (
    <View style={[styles.toastContainer, { borderLeftColor: '#e74c3c' }]}>
      <View style={styles.iconWrap}>
        <Icon name="error" size={26} color="#e74c3c" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.text1}>{props.text1 ?? ''}</Text>
        {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
      </View>
    </View>
  ),
  info: (props: any) => (
    <View style={[styles.toastContainer, { borderLeftColor: '#e4f905ff' }]}>
      <View style={styles.iconWrap}>
        <Icon name="info" size={26} color={'#e4f905ff'} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.text1}>{props.text1 ?? ''}</Text>
        {props.text2 ? <Text style={styles.text2}>{props.text2}</Text> : null}
      </View>
    </View>
  ),
};

const CToast = () => {
  return <Toast config={toastConfig} />;
};

export default CToast;

const styles = StyleSheet.create({
  text1: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },
  text2: {
    fontSize: 10,
    color: '#444',
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderLeftWidth: 6,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrap: {
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    paddingVertical: 6,
  },
});
