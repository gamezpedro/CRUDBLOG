let url = 'http://localhost:8080/blog-api';

    /*
    let settings = {
        method: 'GET'
    };
    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            // console.log(responseJSON);
            for(let i = 0; i < responseJSON.length; i++){
                $(".listOfPets").append(`<li>
                                            ${responseJSON[i].name}
                                        </li>`);
             }
         })
         .catch(err => {
         console.log(err);
        })
        */

function clearFields(){
    $("#idInput").val('');
    $("#titleInput").val('');
    $("#contentInput").val('');
    $("#authorInput").val('');
    $("#dateInput").val('');  
    $("#authorSearch").val('');
    $("#idDelete").val('');
}

function init(){
    getAllBlogs();
    $("#AddPost").on("click", function(e){
        e.preventDefault();
        newPost = {
            title : $("#titleInput").val(),
            content : $("#contentInput").val(),
            author :  $("#authorInput").val(),
            date : new Date($("#dateInput").val())
        };
        postNewBlog(newPost);
    });
    $("#UpdatePost").on("click", function(e){
        e.preventDefault();
        updatePost = {
            id : $("#idInput").val(),
            title : $("#titleInput").val(),
            content : $("#contentInput").val(),
            author :  $("#authorInput").val(),
            date : new Date($("#dateInput").val())
        };
        updateById($("#idInput").val(), updatePost);
    });
    $("#SearchAuthor").on("click", function(e){
        e.preventDefault();
        getBlogsByAuthor($("#authorSearch").val());
        //console.log($("#authorSearch").val())
    });
    $("#Delete").on("click", function(e){
        e.preventDefault();
        deleteById($("#idDelete").val());
    });
    $("#LoadAll").on("click", function(e){
        e.preventDefault();
        getAllBlogs();
    });
}

function getAllBlogs(){
    $.ajax({
        url:(url + '/comentarios'), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            $(".list").empty();
            for(let i = 0; i < responseJSON.length; i++){
                $(".list").append(`<li>  <p>id = ${responseJSON[i].id}</p>
                                                <p>author = ${responseJSON[i].author}</p>
                                                <p>title = ${responseJSON[i].title}</p>
                                                <p>content = ${responseJSON[i].content}</p> 
                                                <p>date = ${responseJSON[i].date}</p>
                                          </li>`);
            }
            clearFields();
        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function getBlogsByAuthor(author){
    //console.log(author);
    $.ajax({
        url:(url + '/comentarios?author=' + author), //url/endpointToAPI,
        method: "GET", 
        data: {}, //Info sent to the API
        dataType : "json", //Returned type od the response
        ContentType : "application/json", //Type of sent data in the request (optional)
        success : function(responseJSON){
            $(".list").empty();
            for(let i = 0; i < responseJSON.length; i++){
                $(".list").append(`<li>   <p>id = ${responseJSON[i].id}</p>
                                                    <p>author = ${responseJSON[i].author}</p>
                                                    <p>title = ${responseJSON[i].title}</p>
                                                    <p>content = ${responseJSON[i].content}</p> 
                                                    <p>publishDate = ${responseJSON[i].date}</p>
                                        </li>`);
            }
            clearFields();

        }, 
        error: function(err){
            console.log("error");
        }
    });
}

function postNewBlog(newBlog){
    console.log(newBlog);
    $.ajax({
        url:(url + '/nuevo-comentario'), //url/endpointToAPI,
        type: "POST", 
        data: JSON.stringify(newBlog),
        contentType: "application/json; charset=utf-8",
        success : function(result){
            getAllBlogs();
        }
    }); 
}

function deleteById(temporalId){
    console.log(temporalId);
    $.ajax({
        url:(url + '/remover-comentario/' + temporalId), //url/endpointToAPI,
        type: "DELETE",
        success : function(res){
            console.log('success on deleting');
            getAllBlogs();
        },
        error : function(err){
            console.log('error on deleting');
        }
    });
}

function updateById(temporalId, updateBlog){
    //console.log(temporalId);
    //console.log(updateBlog);
    $.ajax({
        url:(url + '/actualizar-comentario/' + temporalId), //url/endpointToAPI,
        type: "PUT", 
        data: JSON.stringify(updateBlog),
        contentType: "application/json; charset=utf-8",
        success : function(response){
            getAllBlogs();
        }
    });
}

init();