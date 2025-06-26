import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: 25,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  showHideButton: {
    color: '#007BFF',
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#228B22',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  registerPrompt: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  screenTitle: {
  fontSize: 32,
  fontWeight: 'bold',
  marginBottom: 25,
  color: 'black',
  textAlign: 'center',
  },
});

export default styles;