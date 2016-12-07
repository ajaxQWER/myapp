## 博客文档 ##
### 功能说明 ###


	一、注册
		i.注册页: GET /regist
	二、登录
		i.登录页: POST /login
	三、退出
		i.退出页: GET /exit
	四、查看文章
		i.文章列表: GET /topics
		ii.个人中心 GET /topic?author=
		iii.文章详情 GET /topic/:topicId
	五、发表文章
		i.文章页: GET /topic/addTopic
		ii.发表 POST /posts
	六、修改文章
		i.文章页 GET /topic/:topicId/update
		ii.发表 UPDATE /posts
	七、删除文章
		i.删除 DELETE /topic/:topicId/delete
	八、评论
		i.添加评论 POST /topic/:topicId/comment
		ii.删除评论 DELETE /topic/:topicId/comment/:commentId/delete


### 页面设计 ###

	一、注册页：
		*用户名：username
		*密码:password
		*邮箱：email
		手机号:phone
		其他:
	二、登录页:
		*用户名/邮箱/（手机）：username
		*密码:password
	三、首页:
		文章列表:topics
		个人中心:customer
		其他:
	四、添加文章:
		*标题:title
		*内容：content
	五、添加评论
		*内容:content
	六、个人中心：
		修改用户名:
		修改密码:
		上传头像：
		修改个人简介: