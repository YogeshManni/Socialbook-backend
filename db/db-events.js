class dbEvents {
  constructor(dao) {
    this.dao = dao;
  }

  getEvents() {
    //return this.dao.run(`select * from events order by date desc`);
    return this.dao
      .run(`select ev.*, us.img as userImg, count(cm.discussionid) totalcomments from events ev 
    left  join comments cm on ev.id = cm.discussionid and cm.type like '%event%' 
    left join users us on us.username = ev.username  group by ev.id,us.img  order by date desc`);
  }
  addEvent(data) {
    let fronttext = data.frontText.replaceAll("'", "''");
    // fronttext = fronttext.replaceAll('"', '""');

    let content = data.content.replaceAll("'", "''");
    //  content = content.replaceAll('"', '""');
    const sql = `insert into events(fronttext, img, avtSrc,userName, content, likes, views, date) values(
                  '${fronttext}',
                  '${data.img}',
                  '${data.avtSrc}',
                  '${data.userName}',
                  '${content}',
                  '${0}',
                  '${0}',
                  CURRENT_TIMESTAMP)`;

    return this.dao.run(sql);
  }

  addDiscussion(data) {
    const sql = `insert into discussions(username, name, date) values(
      '${data.username}',
      '${data.name}',
      CURRENT_TIMESTAMP
    ) returning *`;
    return this.dao.run(sql);
  }
  getDiscussions() {
    return this.dao.run(
      `select discussions.*, users.img from discussions  left join users on users.username = discussions.username order by date desc`
    );
  }

  addComments(data) {
    data.comment = data.comment.replaceAll("'", "''");
    const sql = `insert into comments(discussionid, username, comment, date, type) values(
      '${data.discussionid}',
      '${data.username}', 
      '${data.comment}',
      CURRENT_TIMESTAMP,
      '${data.type}') returning *`;
    return this.dao.run(sql);
  }

  getComments(discId, type) {
    return this.dao.run(
      `select *,users.img from comments left join users on users.username = comments.username where discussionid=${discId} and type like '%${type}%' order by date desc`
    );
  }

  updateLikes(data) {
    return this.dao.run(
      `update discussions set likes=${data.likes} where id=${data.id}`
    );
  }

  updateEventLikes(data) {
    return this.dao.run(
      `update events set likes=${data.likes} where id=${data.id}`
    );
  }

  updateEventViews(data) {
    return this.dao.run(
      `update events set views=${data.views} where id=${data.id}`
    );
  }

  updateEvent(data) {
    let fronttext = data.frontText.replaceAll("'", "''");
    let content = data.content.replaceAll("'", "''");
    return this.dao.run(
      `update events set fronttext=$1, img=$2, content=$3, date=CURRENT_TIMESTAMP where id=$4`,
      [fronttext, data.img, content, data.id]
    );
  }

  addDiscussionComm(data) {
    if (!data.firstTime) {
      // Append to existing JSONB content
      return this.dao.run(
        `UPDATE discussiondata
     SET discussion = $3, likes = $4
     WHERE discussionid=$1 and commentid = $2
  `,
        [data.discussionid, data.commentid, data.discussion, data.likes]
      );
    } else {
      // Insert a new message
      return this.dao.run(
        `INSERT INTO discussiondata (discussionid, commentId, name, discussion, likes, date)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [
          data.discussionid,
          data.commentid,
          data.name,
          data.discussion,
          data.likes,
        ]
      );
    }
  }

  getDiscussionComm(discussionid) {
    return this.dao.run(
      `select dd.*, users.img from discussiondata dd left join users on users.username = dd.name where discussionid = $1 order by date desc`,
      [discussionid]
    );
  }
}

module.exports = dbEvents;
