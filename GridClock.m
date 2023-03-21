#import "GridClock.h"
#import <WebKit/WebKit.h>

@implementation GridClock

static NSString * const gridClockModule = @"com.chrstphrknwtn.grid-clock";

- (id)initWithFrame:(NSRect)frame isPreview:(BOOL)isPreview {
    if (!(self = [super initWithFrame:frame isPreview:isPreview])) return nil;
    
    // Preference Defaults
    ScreenSaverDefaults *defaults;
    defaults = [ScreenSaverDefaults defaultsForModuleWithName:gridClockModule];
    
    [defaults registerDefaults:[NSDictionary dictionaryWithObjectsAndKeys:
        @"0", @"screenDisplayOption", // Default to show only on primary display
        nil]];
    
    // Webview
    NSURL* indexHTMLDocumentURL = [NSURL URLWithString:[[[NSURL fileURLWithPath:[[NSBundle bundleForClass:self.class].resourcePath stringByAppendingString:@"/Webview/index.html"] isDirectory:NO] description] stringByAppendingFormat:@"?screensaver=1%@", self.isPreview ? @"&is_preview=1" : @""]];

    WKWebViewConfiguration *webViewConfig = [[WKWebViewConfiguration alloc] init];
    WKWebView *webView = [[WKWebView alloc] initWithFrame:NSMakeRect(0, 0, frame.size.width, frame.size.height) configuration:webViewConfig];
    webView.navigationDelegate = self;
    webView.wantsLayer = YES;
    webView.layer.backgroundColor = [NSColor clearColor].CGColor;
    webView.layer.opaque = NO;
    
    NSURLRequest *request = [NSURLRequest requestWithURL:indexHTMLDocumentURL cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
    [webView loadRequest:request];
    
    // Show on screens based on preferences
    NSArray* screens = [NSScreen screens];
    NSScreen* primaryScreen = [screens objectAtIndex:0];
    
    switch ([defaults integerForKey:@"screenDisplayOption"]) {
        // Primary screen (System Preferences > Displays).
        // The screen the menubar is shown on under 'arrangement'
        case 0:
            if ((primaryScreen.frame.origin.x == frame.origin.x) || isPreview) {
                [self addSubview:webView];
            }
            break;
        // Last Focussed Screen
        // This _sometimes_ results in nothing being shown when previewing in system prefs.
        case 1:
            if (([NSScreen mainScreen].frame.origin.x == frame.origin.x) || isPreview) {
                [self addSubview:webView];
            }
            break;
        // All Screens
        case 2:
            [self addSubview:webView];
            break;
        default:
            [self addSubview:webView];
            break;
    }

    return self;
}

#pragma mark - ScreenSaverView

- (void)animateOneFrame { [self stopAnimation]; }

#pragma mark - Config
// http://cocoadevcentral.com/articles/000088.php

- (BOOL)hasConfigureSheet { return YES; }

- (NSWindow *)configureSheet
{
    ScreenSaverDefaults *defaults;
    defaults = [ScreenSaverDefaults defaultsForModuleWithName:gridClockModule];
    
    if (!configSheet)
    {
        NSNib *nib = [[NSNib alloc] initWithNibNamed:@"ConfigureSheet" bundle:nil];
        if (![nib instantiateWithOwner:self topLevelObjects:nil])
        {
            NSLog( @"Failed to load configure sheet." );
        }
    }
    
    [screenDisplayOption selectItemAtIndex:[defaults integerForKey:@"screenDisplayOption"]];

    return configSheet;
}

- (IBAction)cancelClick:(id)sender
{
    [[NSApplication sharedApplication] endSheet:configSheet];
}

- (IBAction)okClick:(id)sender
{
    ScreenSaverDefaults *defaults;
    defaults = [ScreenSaverDefaults defaultsForModuleWithName:gridClockModule];
    
    // Update our defaults
    [defaults setInteger:[screenDisplayOption indexOfSelectedItem]
               forKey:@"screenDisplayOption"];
    
    // Save the settings to disk
    [defaults synchronize];
    
    // Close the sheet
    [[NSApplication sharedApplication] endSheet:configSheet];
}

#pragma mark - WKNavigationDelegate

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(null_unspecified WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"%@ error=%@", NSStringFromSelector(_cmd), error);
}

#pragma mark Focus Overrides

- (NSView *)hitTest:(NSPoint)aPoint {return self;}
//- (void)keyDown:(NSEvent *)theEvent {return;}
//- (void)keyUp:(NSEvent *)theEvent {return;}
- (void)mouseDown:(NSEvent *)theEvent {return;}
- (void)mouseUp:(NSEvent *)theEvent {return;}
- (void)mouseDragged:(NSEvent *)theEvent {return;}
- (void)mouseEntered:(NSEvent *)theEvent {return;}
- (void)mouseExited:(NSEvent *)theEvent {return;}
- (BOOL)acceptsFirstResponder {return YES;}
- (BOOL)resignFirstResponder {return NO;}

@end
