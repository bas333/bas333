import { Accounts } from 'meteor/accounts-base';

Template.users.helpers({
  numberList(){
    const a= [];
    for(var i=1; i<=100; i++){
      a.push(i);
    }
    return a;
  },
  schoolData(){
    return schools;
  },

  hasProfile(){
    var user = Meteor.userId()&&AllUsers.findOne({owner:Meteor.userId()});
    if(user) {
      return true;
    } else {
      return false;
    }
  }
})

const schools=[
  {name:"Brandeis University"},
  {name:"Boston University"},
  {name:"Boston College"},
  {name:"Babson College"},
  {name:"Northeastern University"}
]

Template.users.onRendered(function(){
  $('.ui.checkbox').checkbox({on: 'checked'});
  this.$('.ui.dropdown').dropdown({on: 'hover'});
  this.$('#signup-form')
    .form({
      fields: {
        name: {
          identifier: 'name',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your name'
            }
          ]
        },
        username: {
          identifier: 'username',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your name'
            }
          ]
        },
        email: {
          identifier: 'email',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your name'
            }
          ]
        },
        password: {
          identifier: 'password',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a password'
            },
            {
              type   : 'minLength[6]',
              prompt : 'Your password must be at least {ruleValue} characters'
            }
          ]
        },
        phone: {
          identifier: 'phone',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter your phone'
            }
          ]
        },
        school: {
          identifier: 'school',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please select a school'
            }
          ]
        },
        gender: {
          identifier: 'gender',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please select a gender'
            }
          ]
        },
        age: {
          identifier: 'age',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please select an age'
            }
          ]
        },
        paymentlist: {
          identifier: 'paymentlist',
          rules: [
            {
              type   : 'checked',
              prompt : 'Please select at least one payment method'
            }
          ]
        },
        terms: {
          identifier: 'terms',
          rules: [
            {
              type   : 'checked',
              prompt : 'You must agree to the terms and conditions'
            }
          ]
        }
      }
    })
  ;
})

Template.users.events({
  'change #uploadpic':function(event){
    //if the pic has input
    if($("#uploadpic").val()){
      //if the input array is not empty, if the first element in the input array is not empty, check the input type is pics
      if(event.currentTarget.files&&event.currentTarget.files[0]&&event.currentTarget.files[0].type.match(/(jpg|png|jpeg|gif)$/)){
        if(event.currentTarget.files[0].size>1048576){//file size out of range
          alert('The file size should be smaller than 1MB');
        }else{
          //an object to read file
          var picreader = new FileReader();
          //when loading the input file
          picreader.onload = function(event){
            var result=event.currentTarget.result;
            // console.log(result);
            $('#picshow').attr('src',result);
            $('#picshow').css('display','block');
          }
          picreader.readAsDataURL(event.currentTarget.files[0]);
        }
      }else{//not a image file
        alert('You are only allowed to upload an image file');
      }
    }else{
      $("#picshow").attr("src","");
      $("#picshow").css("display","none");
    }
  },

  'click #submitnow':function(elt,instance) {
    event.preventDefault();
    if(!$('#signup-form').form('is valid')){
      return;
    }
    const name=instance.$('#name').val();
    const username=instance.$("#username").val();
    const school=instance.$('#school').val();
    const age=instance.$('#age').val();
    const email=instance.$('#email').val();
    const phone=instance.$('#phone').val();
    const password=instance.$('#password').val();
    const gender=instance.$('#gender :selected').text();
    paymethodinputs = instance.$("#paymentlist input");
    paymethod = [];
    paymethodinputs.each(function(a,b){
      if (b.checked) { paymethod.push(b.value);}
    });
    cart=[];
    soldhistory=[];
    chatlist=[];
    const pic=instance.$('#uploadpic')[0].files[0];
    console.log('adding '+username);
    instance.$('#username').val("");
    instance.$('#name').val("");
    instance.$('#school').val("");
    instance.$('#gender').val("");
    instance.$('#age').val("");
    instance.$('#email').val("");
    instance.$('#phone').val("");

    alert("new user id =");
    var newUser = {
      name:name,
      username:username,
      age:age,
      school:school,
      gender:gender,
      email:email,
      phone:phone,
      paymethod:paymethod,
      cart:cart,
      soldhistory:soldhistory,
      chatlist:chatlist,
      pic:pic,
      owner:Meteor.userId(),
      createAt:new Date()
    };
    var credentials = {email,password};
    console.log("credentials are ");
    console.dir(credentials);
    Accounts.createUser(credentials,
     function(error,result){
        userid = Meteor.userId();
        newUser.owner = userId;
        // AllUsers.insert(newUser);
        Meteor.call('users.insert',newUser, function(err, result){
          if(err){
            window.alert(err);
            return;
          }
        });
      });
    // alert("Create new user"+JSON.stringify(newUser)+password);
    // Meteor.call('users.createuser',email,password, newUser,function(error,result){
    //   alert("error="+error+"result="+result);
    // });
    if($('#uploadpic').val()){
      if($('#uploadpic')[0].files&&$('#uploadpic')[0].files[0] && ($('#uploadpic')[0].files[0].type).match(/(jpg|png|jpeg|gif)$/)){
        if($('#uploadpic')[0].files[0].size>1048576){
          alert('The file size should be smaller than 1MB');
        }else{
          var imagefile=$('#uploadpic')[0].files[0];
          var imageConvertTo64Base=function(imagefile,callback){
            var reader=new FileReader();
            reader.onload=function(){
              var dataURL = reader.result;
              imageBase64Form=dataURL.split(',')[1];
              callback(imageBase64Form);
            };
          reader.readAsDataURL(pic);
        };

        //send to server
        imageConvertTo64Base(imagefile,function(imageBase64Form){
          //add a new field into newuser
          newUser.pic=imageBase64Form;
          Meteor.call('users.insert',newUser, function(err, result){
            if(err){
              window.alert(err);
              return;
            }
          });
        });

        }
      }else{
        $("#picshow").attr("src","");
        $("#picshow").css("display","none");
        alert("Please add a image file");
      }
    }else{
      console.log('adding '+username);
      Meteor.call('users.insert',newUser, function(err, result){
        if(err){
          window.alert(err);
          return;
        }
      });
    }
  }})

Template.showprofile.helpers({
  numberList(){
    const a= [];
    for(var i=1; i<=100; i++){
      a.push(i);
    }
    return a;
  },
  schoolData(){
    return schools;
  }
})

Template.showuser.helpers({
  peoplelist() {return AllUsers.find()},
  isOwner(person){
    console.log(person);
    return person.owner==Meteor.userId();
  }
})

Template.users.helpers({
    hasPerson(){
      return AllUsers.findOne({owner:Meteor.userId()})
    }
})

Template.showprofile.events({
  'change #editpicfile':function(event){
    //if the pic has input
    if($("#editpicfile").val()){
      //if the input array is not empty, if the first element in the input array is not empty, check the input type is pics
      if(event.currentTarget.files&&event.currentTarget.files[0]&&event.currentTarget.files[0].type.match(/(jpg|png|jpeg|gif)$/)){
        if(event.currentTarget.files[0].size>1048576){//file size out of range
          alert('The file size should be smaller than 1MB');
        }else{
          //an object to read file
          var picreader = new FileReader();
          //when loading the input file
          picreader.onload = function(event){
            var result=event.currentTarget.result;
            console.log(result);
            $('#editpicshow').attr('src',result);
            $('#editpicshow').css('display','block');
          }
          picreader.readAsDataURL(event.currentTarget.files[0]);
        }
      }else{//not a image file
        alert('You are only allowed to upload an image file');
      }
    }else{
      $("#editpicshow").attr("src","");
      $("#editpicshow").css("display","none");
    }
  },
  'click #editpic':function(elt,instance){
    $("#newpic").css("display","block");
  },
  'click #updatePic':function(elt,instance){
    event.preventDefault();
    const pic=instance.$('#editpicfile')[0].files[0];

    var pic_base64;
    if($('#editpicfile').val()){
      if(($('#editpicfile')[0].files&&$('#editpicfile')[0].files[0]) && ($('#editpicfile')[0].files[0].type).match(/(jpg|png|jpeg|gif)$/)){
        if($('#editpicfile')[0].files[0].size>1048576){
          alert('The file size should be smaller than 1MB');
        }else{
          var imagefile=$('#editpicfile')[0].files[0];
          var imageConvertTo64Base=function(imagefile,callback){
            var reader=new FileReader();
            reader.onload=function(){
              var dataURL = reader.result;
              imageBase64Form=dataURL.split(',')[1];
              callback(imageBase64Form);
            };
          reader.readAsDataURL(pic);
        };

        //send to server
        imageConvertTo64Base(imagefile,function(imageBase64Form){
          //add a new field into newuser
          var newpic=imageBase64Form;
          Meteor.call('users.updatePic',Meteor.userId(),newpic);
          $('#editpicfile').val("")
        });
        }
        $("#newpic").css("display","none");
      }else{
        $("#editpicshow").attr("src","");
        $("#editpicshow").css("display","none");
        alert("Please add a image file");
      }
    }
  },


  'click #editPic':function(elt,instance){
    $("#newpic").css("display","block");
  },
   'click #editName':function(elt,instance){
      $("#newname").css("display", "block");
   },
   'click #editSchool':function(elt,instance){
     $("#newschool").css("display","block");
   },
   'click #editAge':function(elt,instance){
      $("#newage").css("display", "block");
   },
   'click #editGender':function(elt,instance){
      $("#newgender").css("display", "block");
   },
   'click #editEmail':function(elt,instance){
      $("#newemail").css("display", "block");
   },
   'click #editPaymethod':function(elt,instance){
      $("#newpayment").css("display", "block");
   },
   'click #cancelPaymethod':function(elt,instance){
      $("#newpayment").css("display", "none");
   },
   'click #cancelEmail':function(elt,instance){
      $("#newemail").css("display", "none");
   },
   'click #cancelGender':function(elt,instance){
      $("#newgender").css("display", "none");
   },
   'click #cancelAge':function(elt,instance){
      $("#newage").css("display", "none");
   },
   'click #cancelSchool':function(elt,instance){
     $("#newschool").css("display","none");
   },
   'click #cancelName':function(elt,instance){
      $("#newname").css("display", "none");
   },
   'click #updateUsername1':function(elt,instance){
     const name=instance.$('#usernameUpdate').val();
     console.log('modifying '+name);
     Meteor.call('allusers.updateName',Meteor.userId(),name);
     instance.$('#usernameUpdate').val("");
     instance.$("#newname").css("display", "none");
   },
   'click #removeProfile':function(elt,instance){
     console.log(this.person);
     Meteor.call('users.remove',this.person);
   },
   'click #updateSchool':function(elt,instance){
     const school=instance.$('#school2').val();
     console.log(school);
     Meteor.call('users.updateSchool',Meteor.userId(),school);
     $("#newschool").css("display","none");
   },
   'click #updateAge':function(elt,instance){
     const age=instance.$('#age2').val();
     console.log(age);
     Meteor.call('users.updateAge',Meteor.userId(),age);
     $("#newage").css({display:"none"});
   },
   'click #updateGender':function(elt,instance){
     const gender=instance.$("#gender2").val();
     console.log(gender);
     Meteor.call('users.updateGender',Meteor.userId(),gender);
     $("#newgender").css({display:"none"});
   },
   'click #updateEmail':function(elt,instance){
     const email=instance.$('#emailUpdate').val();
     Meteor.call('users.updateEmail',Meteor.userId(),email);
     instance.$('#emailUpdate').val("");
     $("#newemail").css({display:"none"});
   },
   'click #updatePaymethod':function(elt,instance){
     paymethodinputs = instance.$("#newpayment input");
     paymethod = [];
     paymethodinputs.each(function(a,b){
       if (b.checked) { paymethod.push(b.value);}
     });
     console.log(paymethod);
     Meteor.call('users.updatePaymethod',Meteor.userId(),paymethod);
     $("#newpayment").css({display:"none"});
   }
})
