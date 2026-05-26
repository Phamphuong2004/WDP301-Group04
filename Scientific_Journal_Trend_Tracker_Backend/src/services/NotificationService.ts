import Notification from "../models/Notification";

export class NotificationService {
  static async getUserNotifications(
    userId: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments({ userId });

    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  static async getUnreadCount(userId: string) {
    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return { unreadCount: count };
  }

  static async getUnreadNotifications(userId: string) {
    const notifications = await Notification.find({
      userId,
      isRead: false,
    }).sort({ createdAt: -1 });

    return notifications;
  }

  static async markAsRead(notificationId: string) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw { status: 404, message: "Notification not found" };
    }

    return notification;
  }

  static async markAllAsRead(userId: string) {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return { message: "All notifications marked as read" };
  }

  static async deleteNotification(notificationId: string) {
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      throw { status: 404, message: "Notification not found" };
    }

    return { message: "Notification deleted" };
  }

  static async clearAllNotifications(userId: string) {
    await Notification.deleteMany({ userId });

    return { message: "All notifications cleared" };
  }

  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    refId?: string,
    refType?: string,
  ) {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      refId,
      refType,
      isRead: false,
      createdAt: new Date(),
    });

    await notification.save();

    return notification;
  }

  static async bulkCreateNotifications(
    userIds: string[],
    title: string,
    message: string,
    type: string,
    refId?: string,
    refType?: string,
  ) {
    const notifications = userIds.map((userId) => ({
      userId,
      title,
      message,
      type,
      refId,
      refType,
      isRead: false,
      createdAt: new Date(),
    }));

    const result = await Notification.insertMany(notifications);

    return result;
  }

  static async getNotificationsByType(userId: string, type: string) {
    const notifications = await Notification.find({ userId, type }).sort({
      createdAt: -1,
    });

    return notifications;
  }
}
