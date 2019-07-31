import {StyleSheet} from "react-native" 

const CommonStyles = StyleSheet.create({
	buttonContainer: {
		display: 'flex',
		height: 50,
		margin: 10,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2AC062',
		shadowColor: '#2AC062',
		shadowOpacity: 0.4,
		shadowOffset: { height: 10, width: 0 },
		shadowRadius: 20,
	},
	text: {
		fontSize: 16,
		color: '#FFFFFF',
	},
	modal: {
		flex:1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		padding: 10
	},
	modalcontainer : {
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 10
	},
	popupMenu: {
		borderColor:'#eee',
		borderBottomWidth:0.5,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 45, 
		marginTop: 10
	},
	input: {
    height: 40,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5
  },
});

export default CommonStyles;