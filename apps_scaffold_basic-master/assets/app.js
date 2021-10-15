// Initialise Apps framework client. See also:
// https://developer.zendesk.com/apps/docs/developer-guide/getting_started
var client = ZAFClient.init();
var userGroups = {};
client.invoke('resize', { width: '100%', height: '200px' });
console.log('--- test string ---');
client.get(['currentUser']).then(function(data){
    var user_id = data.currentUser.id;
    console.log(`User ID: ${user_id}`);
    client.request(`/api/v2/users/${user_id}/group_memberships.json`).then(
        function(groups){
            var group_memberships = groups['group_memberships'];
            console.log('User groups:\n');
            for (var i=0; i < group_memberships.length; i++){
                var group_id = group_memberships[i]['group_id'];
                console.log(`Group: ${group_id}\nIndex: ${i}`);
                userGroups[group_id] = {'id': group_id, 'name': null, 'views': []};
                client.request(`/api/v2/groups/${group_id}.json`).then(
                    function(group){
                        var resp = group['group'];
                        var id = parseInt(resp['id']);
                        var name = resp['name'];
                        console.log(`Group ID: ${id}\nGroup Name: ${name}`);
                        userGroups[id]['name'] = name;
                        client.request({
                            url: '/api/v2/views/search.json',
                            data: `query=group_id:${id}`
                        }).then(
                           function(views){
                                console.log(views);
                                var resp = views['views'];

                                for (var v in resp){
                                    console.log(`View: ${v}`);
                                    userGroups[id]['views'].push({
                                        'title': resp[v]['title'], 
                                        'url': resp[v]['url']
                                    })
                                }
                            },
                            function(response){
                                console.error(response.responseText);
                            }
                        )
                    }
                )
            }
        },
        function(response){
            console.error(response.responseText);
        }
    );
});
console.log(userGroups);