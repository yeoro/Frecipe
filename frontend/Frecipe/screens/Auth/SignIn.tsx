import React, { Component } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text, Button, Input } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/Auth';
import { RouteProp } from '@react-navigation/native';

import { connect, Dispatch } from 'react-redux';
import { login } from '../../redux/usersSlice';
import { list } from '../../redux/communitySlice';

import api from '../../api';

interface Login {
  token: string;
  userNo: number;
  username: string;
  nickname: string;
  phone: string;
  img: string | null;
}

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, 'SignIn'>;
  route: RouteProp<AuthStackParamList, 'SignIn'>;
  login: ({ token, userNo, username, nickname, phone, img }: Login) => void;
  list: typeof list;
}

interface State {
  username: string;
  password: string;
}

class SignIn extends Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  isEmail = (username: string) => {
    const regEx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regEx.test(username);
  };

  isFormValid = () => {
    const { username, password } = this.state;

    if (username === '' || password === '') {
      alert('모든 필드를 채워주세요.');
      return false;
    }
    if (!this.isEmail(username)) {
      alert('올바른 이메일이 아닙니다.');
      return false;
    }
    return true;
  };

  doSignIn = async () => {
    const { username, password } = this.state;

    if (!this.isFormValid()) {
      return;
    }

    try {
      const { data: token } = await api.login({ username, password });
      const { data } = await api.getUser(token);

      const getRecipe = await api.getRecipe();
      this.props.list(getRecipe.data);

      const { login } = this.props;
      login({
        token: token,
        userNo: data.userNo,
        username: username,
        nickname: data.nickname,
        phone: data.phone,
        img: data.img,
      });
    } catch (event) {
      console.error(event);
    }
  };

  render() {
    const { username, password } = this.state;
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />
            <Input
              value={username}
              onChangeText={(username: string) => this.setState({ username })}
              containerStyle={styles.inputContainer}
              placeholder="email@address.com"
              keyboardType="email-address"
              leftIcon={
                <MaterialIcons name="email" size={24} color="#00BD75" />
              }
            />
            <Input
              value={password}
              onChangeText={(password: string) => this.setState({ password })}
              containerStyle={styles.inputContainer}
              placeholder="비밀번호"
              secureTextEntry={true}
              leftIcon={<MaterialIcons name="lock" size={24} color="#00BD75" />}
            />
            <Button
              title="로그인"
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              titleStyle={styles.title}
              onPress={this.doSignIn}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Find')}>
              <Text style={styles.text}>이메일 / 비밀번호 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.text}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    login: (form: Login) => dispatch(login(form)),
    list: (form: any) => dispatch(list(form)),
  };
};

export default connect(null, mapDispatchToProps)(SignIn);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    marginTop: 20,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    backgroundColor: '#00BD75',
    borderWidth: 2,
    borderColor: '#00BD75',
    borderRadius: 6,
  },
  buttonContainer: {
    marginTop: 10,
    height: 60,
    width: 183,
  },
  title: { fontWeight: 'bold' },
});
