Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Meteor.setInterval(
  function() {
    Meteor.call('lastSeen');
  }, 1000
)

Template.header.helpers({
  usersOnline: function() {
    return Meteor.users.find({
      'profile.isOnline': true, 
      _id: {$ne: Meteor.userId()}
    }).fetch();
  }
})

Template.taskLists.helpers({
  lists: function() {
    return Lists.find();
  }
});

Template.taskList.helpers({
  tasks: function() {
    return Tasks.find({listId: this._id});
  }
});

Template.taskList.events({
  'click .addTask': function() {
    // insert a task and set it to edit mode
    var newTaskId = Tasks.insert({listId: this._id, title: 'New Task'});
    Session.set('editing-task-id', newTaskId);
  }
});

Template.task.helpers({
  editing: function() { 
    return Session.equals('editing-task-id', this._id); 
  }
});

Template.task.events({
  'click .edit': function() {
    Session.set('editing-task-id', this._id); 
  },
  'click .done': function() {
    Session.set('editing-task-id', null); 
  }
})

Template.taskForm.helpers({
  lists: function() {
    var task = this;
    return Lists.find().map(function(list) {
      list.selected = (task.listId === list._id);
      return list;
    });
  },
  listCheckedAttr: function() {
    return this.selected && 'checked';
  }
});

Template.taskForm.events({
  'keyup [name=title]': function() {
    Tasks.update(this._id, {$set: {title: $(event.target).val()}});
  },
  'keyup [name=description]': function() {
    Tasks.update(this._id, {$set: {description: $(event.target).val()}});
  },
  'change [name=listId]': function(event, template) {
    Tasks.update({_id: template.data._id}, {$set: {listId: this._id}});
  },
  'click .delete': function(event) {
    event.preventDefault();
    Tasks.remove(this._id);
  }
});
