#import <ScreenSaver/ScreenSaver.h>
#import <WebKit/WebKit.h>

@interface GridClock : ScreenSaverView <WKNavigationDelegate>
{
    IBOutlet id configSheet;
    IBOutlet id screenDisplayOption;
}
@end
