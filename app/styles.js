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

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    width: 130,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  staticText: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 8,
  },
  removeTagText: {
    color: 'red',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  editButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  searchCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchUserText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  searchMessageButton: {
    backgroundColor: '#228B22',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  searchMessageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  conversationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  conversationTextWrapper: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  conversationMessage: {
    color: '#555',
    marginTop: 2,
  },
  conversationTimestamp: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  blueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  outerContainerMsg: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  backButtonMsg: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    width: 36,
    height: 36,
    backgroundColor: '#228B22', // green
  },
  backButtonTextMsg: {
    color: 'white',
    fontSize: 22,
    lineHeight: 22,
  },
  headerTitleMsg: {
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  messagesScrollViewMsg: {
    flex: 1,
  },
  messagesContentContainerMsg: {
    padding: 12,
    paddingBottom: 20,
  },
  messageBubbleMineMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#228B22', // green bubble for your messages
    borderRadius: 18,
    padding: 12,
    marginVertical: 6,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  messageBubbleOtherMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    borderRadius: 18,
    padding: 12,
    marginVertical: 6,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  messageTextMineMsg: {
    color: 'white',
    fontSize: 16,
  },
  messageTextOtherMsg: {
    color: 'black',
    fontSize: 16,
  },
  inputContainerMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: 'white',
  },
  textInputMsg: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  sendButtonMsg: {
    marginLeft: 10,
    backgroundColor: '#228B22',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonTextMsg: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainerMsg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 0,
  },

  backButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  backButtonText: {
    fontSize: 30,
    color: 'green',      // green arrow
    fontWeight: 'bold',
  },

  headerTitleWithMargin: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: '600',
    color: '#000',       // or your preferred text color
  },

  // Make sure you have headerTitleMsg somewhere or add like this:
  headerTitleMsg: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
});

export default styles;