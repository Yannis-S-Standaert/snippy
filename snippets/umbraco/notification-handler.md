
notification-handler
umbraco
name:notificationName
---
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;

namespace Umbraco.Cms.Core.Events;

public class @:name:NotificationName:@NotificationHandler : INotificationHandler<ContentSavedNotification>
{
    private readonly IRuntimeState _runtimeState;

    public CustomNotificationHandler(IRuntimeState runtimeState)
    {
        _runtimeState = runtimeState;
    }

    public void Handle(ContentSavedNotification notification)
    {
        if (_runtimeState.Level != RuntimeLevel.Run)
        {
            return;
        }

        foreach (var contentItem in notification.SavedEntities)
        {

        }
    }
}