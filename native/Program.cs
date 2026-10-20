using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Tizen.Applications;
using Tizen.Applications.Messages;
class Program {
 static MessagePort? port;static DeviceService? service;static string token="";static CatalogueService? catalogue;
 static readonly JsonSerializerOptions JsonOptions=new(){PropertyNamingPolicy=JsonNamingPolicy.CamelCase};
 static bool Equal(string a,string b){var x=Encoding.UTF8.GetBytes(a);var y=Encoding.UTF8.GetBytes(b);return x.Length==y.Length&&CryptographicOperations.FixedTimeEquals(x,y);}
 public static void Start(){
  using var config=JsonDocument.Parse(File.ReadAllText(Path.GetFullPath(Path.Combine(AppContext.BaseDirectory,"../res/device-auth.json"))));token=config.RootElement.GetProperty("token").GetString()??"";if(token.Length<40)throw new InvalidOperationException("Invalid local configuration");
  service=new DeviceService(true);catalogue=new CatalogueService();port=new MessagePort("HomeDeviceControl",true);port.MessageReceived+=Received;port.Listen();
 }
 static async void Received(object? sender,MessageReceivedEventArgs e){
  if(!e.Remote.Trusted||e.Remote.AppId!="QuietTV001.QuietTV"||e.Remote.PortName!="HomeDeviceReplies")return;
  string id="";object result;
  try{var request=e.Message.GetItem<string>("request");if(request.Length>4096)throw new InvalidOperationException("Request too large");using var json=JsonDocument.Parse(request);var root=json.RootElement;id=root.GetProperty("id").GetString()??"";if(id.Length==0||id.Length>80)return;if(!Equal(root.GetProperty("token").GetString()??"",token))return;var route=root.GetProperty("route").GetString()??"";using var empty=JsonDocument.Parse("{}");var payload=(root.TryGetProperty("data",out var data)?data:empty.RootElement).Clone();result=route.StartsWith("catalogue/",StringComparison.Ordinal)?await catalogue!.Handle(route,payload):service!.Handle(route,payload);
  }catch(Exception ex){result=new{error=ex is JsonException?"Invalid request":ex.Message};}
  if(id.Length==0)return;
  var text=JsonSerializer.Serialize(result,JsonOptions);if(text.Length>64000)text=JsonSerializer.Serialize(new{error="The response is too large. Choose a category to narrow the list."});var count=(text.Length+499)/500;
  for(int i=0;i<count;i++){using var reply=new Bundle();reply.AddItem("id",id);reply.AddItem("part",i.ToString());reply.AddItem("count",count.ToString());reply.AddItem("payload",text.Substring(i*500,Math.Min(500,text.Length-i*500)));try{port!.Send(reply,e.Remote.AppId,e.Remote.PortName,true);}catch{break;}}
 }
 static void Main(string[] args){using var app=new ControlsApplication();app.Run(args);}
}
class ControlsApplication:CoreUIApplication {
 protected override void OnCreate(){base.OnCreate();try{Program.Start();}catch(Exception e){try{File.WriteAllText(Path.Combine(Current.DirectoryInfo.Data,"startup-error.txt"),e.GetType().Name+": "+e.Message);}catch{}Exit();}}
}
