import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Image } from "react-native";
import React, { Component } from "react";
import UserInfo from "../UserInfo"
import Config from "../Config"

export default class UpdateFriendSceen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: UserInfo.id,
			friendIdList: [],
			friendList: [],
			search: "임호성",
			arrayholder: [],
			searchflag: false,
		};
		this.arrayholder = []
	}
	getFriendIdList = () => {
		fetch(Config.host + '/get/user/friendList/' + UserInfo.id)
			.then((response) => response.json())
			.then((responseJson) => { this.setState({ friendIdList: responseJson[0].friendList }, () => this.getFriendList()); })
			.catch((error) => { alert('Get Friend List fail!', error); });
	}

	getFriendList = () => {
		let myList = this.state.friendIdList.map(id => {
			return fetch(Config.host + '/get/user/' + id)
				.then(response => response.json())
				.then(responseJson => { return responseJson })
				.catch(error => {
					console.log(error);
					return null;
				})
		});
		Promise.all(myList).then(result => {
			this.setState({ friendList: result }, () => console.log(this.state.friendList));
		})
	}

	async searchDB() {
		await fetch(Config.host + '/get/search/user/' + String(this.state.search))
			.then((resopnse) => resopnse.json())
			.then((resopnseJson) => {
				console.log("검색결과 " + resopnseJson);
				var joined = this.arrayholder.concat(resopnseJson);
				this.setState({ arrayholder: joined })
			})
			.catch((error) => { alert(error); });
		this.setState({ searchflag: true });
	}

	addFriend = (f_id) => {
		return new Promise((resolve, reject) => {
			fetch(Config.host + '/update/user/friendList', {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: this.state.userId,
					friendList: f_id
				})
			}).then(response => {
				console.log("friendList update success", response);
				resolve();
			}).catch(error => {
				console.log("update error", error);
				reject();
			});
		})
	}

	deleteFriend = (f_id) => {
		return new Promise((resolve, reject) => {
			fetch(Config.host + '/delete/user/friendList', {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: this.state.userId,
					friendList: f_id
				})
			}).then(response => {
				console.log("friendList delete success", response);
				resolve();
			}).catch(error => {
				console.log("delete error", error);
				reject();
			});
		})
	}
	componentDidMount() {
		this.getFriendIdList();
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.topbar}>
					<Text style={{color: 'white'}}>친구관리</Text>
				</View>
				<View style={styles.searchbar}>
					<TextInput style={styles.textBox} returnKeyType={'search'}
						onChangeText={(search) => this.setState({ search })} onSubmitEditing={() => this.searchDB()}
						value={this.state.search} />
					<TouchableOpacity style={styles.buttonContainer} onPress={() => this.searchDB()}>
						<Text>검색</Text>
					</TouchableOpacity>
				</View>
				{this.state.searchflag && (
					<View>
						<Text>검색 결과</Text>
						{this.state.arrayholder.map(friends => (
							<View style={styles.elem}>
								<View style={styles.userInfo}>
									<Image style={styles.profile} source={{ uri: Config.host + "/picture/" + friends.profileImg }} />
									<Text style={styles.name}>{friends.nickname}</Text>
								</View>
								{ this.state.friendIdList.some(x => x==friends.userId)||this.state.userId==friends.userId?(
									<Text>-</Text>
								):(
									<Button style = {styles.button}title="추가" 
									onPress={()=>{this.addFriend(friends.userId)
										.then(this.getFriendIdList)
										.then(this.props.navigation.getParam('refresh')())}}/>
								)}
							</View>
						))}
					</View>
				)}
				<Text>친구 목록</Text>
				{this.state.friendList.map(friends => (
					<View style={styles.elem}>
						<View style={styles.userInfo}>
							<Image style={styles.profile} source={{ uri: Config.host + "/picture/" + friends[0].profileImg }} />
							<Text style={styles.name}>{friends[0].nickname}</Text>
						</View>
						<Button style={styles.button} title="삭제"
							onPress={() => { this.deleteFriend(friends[0].userId).then(this.getFriendIdList) }} />
					</View>)
				)}
			</View>
		);

	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	elem: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderColor: '#eee',
		borderBottomWidth: 0.5,
		padding: 5,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		padding: 8,
		backgroundColor: 'yellow',
		borderRadius: 5,
	},
	profile: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'yellow',
	},
	name: {
		paddingLeft: 10,
	},
	textBox:
	{
		fontSize: 18,
		alignSelf: 'stretch',
		width: '78%',
		height: 50,
		paddingRight: 45,
		paddingLeft: 8,
		borderWidth: 1,
		paddingVertical: 0,
		borderColor: 'grey',
		borderRadius: 5,
		margin: 10,
		marginRight: 5
	},
	searchbar: {
		flexDirection: 'row',
	},
	buttonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '15%',
		height: 50,
		margin: 10,
		marginLeft: 5,
		borderRadius: 5,
		backgroundColor: '#fff',
		borderColor: '#000',
		borderWidth: 1
	},
	topbar: {
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
	}
})