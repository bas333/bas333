Template.chatroom.helpers({
  mychatlist(){
    var mychatlist=[];
    var chatids=AllUsers.findOne({owner:Meteor.userId}).chatlist;
    console.log(chatids);
    for (var chat in chatids){
      for (var userid in chat.users_id){
        if (usersid!=Meteor.owner){
          var user=AllUsers.findOne({owner:userid})
          mychatlist.push(user);
        }
      }
    }
    console.log(mychatlist);
    return mychatlist;
  }
})