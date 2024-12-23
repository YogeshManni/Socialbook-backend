class dbPosts {
  constructor(dbo) {
    this.dbo = dbo;
  }

  async addPost(data) {
    const currentDateTime = new Date();
    const query = `insert into posts(username,email,likes, img, caption, date, liked_users, type,story) values(
      $1,$2,$3,$4,$5,CURRENT_TIMESTAMP,$6,$7,$8)`;

    return await this.dbo.run(query, [
      data.username,
      data.email,
      data.likes,
      data.img,
      data.caption,
      data.liked_users,
      data.type,
      data.story,
    ]);
  }

  async getPosts(email) {
    const query = `select pt.*,count(cm.discussionid) totalcomments,us.img profilepic from posts pt left join comments cm on pt.id=cm.discussionid and cm.type='posts' left join users us on pt.username = us.username  where pt.story = false group by pt.id, us.img order by pt.date desc`;
    return await this.dbo.run(query);
  }

  async updateLikes(data) {
    const query =
      data.type === "rem"
        ? `update posts set likes = likes - 1,liked_users = array_remove(liked_users, '${data.username}') where id='${data.id}'`
        : `update posts set likes = likes + 1,liked_users = liked_users || ARRAY['${data.username}'] where id='${data.id}'`;
    return await this.dbo.run(query);
  }

  async getStories(email) {
    const query = `select pt.*,count(cm.discussionid) totalcomments,us.img profilepic from posts pt left join comments cm on pt.id=cm.discussionid and cm.type='posts' left join users us on pt.username = us.username  where pt.story = true group by pt.id, us.img order by pt.date desc`;
    return await this.dbo.run(query);
  }
}

module.exports = dbPosts;
