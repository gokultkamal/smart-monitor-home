using System.Runtime.InteropServices;
using System.Text;
static class Native {
 public const string W="libcapi-network-wifi-manager.so.1",B="libcapi-network-bluetooth.so.0",G="libglib-2.0.so.0";
 [UnmanagedFunctionPointer(CallingConvention.Cdecl)] public delegate void Done(int result,IntPtr data);
 [UnmanagedFunctionPointer(CallingConvention.Cdecl)] [return:MarshalAs(UnmanagedType.I1)] public delegate bool Each(IntPtr ap,IntPtr data);
 [UnmanagedFunctionPointer(CallingConvention.Cdecl)] public delegate int Idle(IntPtr data);
 [DllImport(G)] public static extern IntPtr g_main_loop_new(IntPtr context,bool running);
 [DllImport(G)] public static extern void g_main_loop_run(IntPtr loop);
 [DllImport(G)] public static extern uint g_idle_add(Idle callback,IntPtr data);
 [DllImport("libc")] public static extern void free(IntPtr ptr);
 [DllImport(W)] public static extern int wifi_manager_initialize(out IntPtr h);
 [DllImport(W)] public static extern int wifi_manager_get_connection_state(IntPtr h,out int state);
 [DllImport(W)] public static extern int wifi_manager_get_connected_ap(IntPtr h,out IntPtr ap);
 [DllImport(W)] public static extern int wifi_manager_foreach_found_ap(IntPtr h,Each cb,IntPtr data);
 [DllImport(W)] public static extern int wifi_manager_scan(IntPtr h,Done cb,IntPtr data);
 [DllImport(W)] public static extern int wifi_manager_ap_clone(out IntPtr clone,IntPtr ap);
 [DllImport(W)] public static extern int wifi_manager_ap_destroy(IntPtr ap);
 [DllImport(W)] public static extern int wifi_manager_ap_get_essid(IntPtr ap,out IntPtr text);
 [DllImport(W)] public static extern int wifi_manager_ap_get_rssi(IntPtr ap,out int rssi);
 [DllImport(W)] public static extern int wifi_manager_ap_get_security_type(IntPtr ap,out int security);
 [DllImport(W)] public static extern int wifi_manager_ap_get_connection_state(IntPtr ap,out int state);
 [DllImport(W)] public static extern int wifi_manager_ap_is_favorite(IntPtr ap,out bool favorite);
 [DllImport(W)] public static extern int wifi_manager_ap_set_passphrase(IntPtr ap,string passphrase);
 [DllImport(W)] public static extern int wifi_manager_connect(IntPtr h,IntPtr ap,Done cb,IntPtr data);
 [DllImport("libsettings-api.so")] [return:MarshalAs(UnmanagedType.I1)] public static extern bool CSharpGetItemValue(string id,out IntPtr name,out IntPtr value);
 [DllImport("libsettings-api.so")] [return:MarshalAs(UnmanagedType.I1)] public static extern bool CSharpSetItemValue(string id,string value);
 [DllImport("libsettings-api.so")] [return:MarshalAs(UnmanagedType.I1)] public static extern bool CSharpGetItemEnable(string id,[MarshalAs(UnmanagedType.I1)] out bool enabled);
 [DllImport("libsettings-api.so")] [return:MarshalAs(UnmanagedType.I1)] public static extern bool settings_get_item_minmax_step(string id,out double min,out double max,out double step);
 [DllImport(B)] public static extern int bt_initialize();
 [DllImport(B)] public static extern int bt_adapter_get_state(out int state);
 [DllImport(B)] public static extern int bt_adapter_start_device_discovery();
 [DllImport(B)] public static extern int bt_adapter_stop_device_discovery();
 [DllImport(B)] public static extern int bt_adapter_foreach_bonded_device(Each cb,IntPtr data);
 [DllImport(B)] public static extern int bt_device_create_bond(string address);
 [DllImport(B)] public static extern int bt_device_set_bond_created_cb(Bond cb,IntPtr data);
 [DllImport(B)] public static extern int bt_adapter_set_device_discovery_state_changed_cb(Discovery cb,IntPtr data);
 [DllImport(B)] public static extern int bt_audio_initialize();
 [DllImport(B)] public static extern int bt_audio_connect(string address,int profile);
 [DllImport(B)] public static extern int bt_hid_host_initialize(Connection cb,IntPtr data);
 [DllImport(B)] public static extern int bt_hid_host_connect(string address);
 [DllImport(B)] public static extern int bt_device_set_connection_state_changed_cb(DeviceConnection cb,IntPtr data);
 [UnmanagedFunctionPointer(CallingConvention.Cdecl)] public delegate void Discovery(int result,int state,IntPtr device,IntPtr data);
 [UnmanagedFunctionPointer(CallingConvention.Cdecl)] public delegate void Bond(int result,IntPtr device,IntPtr data);
 [UnmanagedFunctionPointer(CallingConvention.Cdecl)] public delegate void Connection(int result,[MarshalAs(UnmanagedType.I1)] bool connected,IntPtr address,IntPtr data);
 [UnmanagedFunctionPointer(CallingConvention.Cdecl)] public delegate void DeviceConnection([MarshalAs(UnmanagedType.I1)] bool connected,IntPtr info,IntPtr data);
 [StructLayout(LayoutKind.Sequential)] public struct Class {public int major,minor,service;}
 [StructLayout(LayoutKind.Sequential)] public struct Device {public IntPtr address,name;public Class kind;public IntPtr uuids;public int count;[MarshalAs(UnmanagedType.I1)]public bool paired;[MarshalAs(UnmanagedType.I1)]public bool connected;[MarshalAs(UnmanagedType.I1)]public bool authorized;public int dataLength;public IntPtr data;}
 [StructLayout(LayoutKind.Sequential)] public struct Found {public IntPtr address,name;public Class kind;public int rssi;[MarshalAs(UnmanagedType.I1)]public bool paired;public IntPtr uuids;public int count,appearance,dataLength;public IntPtr data;}
 public static string Text(IntPtr p)=>p==IntPtr.Zero?"":Marshal.PtrToStringUTF8(p)??"";
}
