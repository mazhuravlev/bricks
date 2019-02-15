using System;
using System.IO;
using System.Windows.Input;
using System.Windows.Media;
using CefSharp;
using CefSharp.Wpf;
using Microsoft.Win32;

namespace Bricks
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        public MainWindow()
        {
            Directory.CreateDirectory("strings");
            var bricksUrl = Environment.GetEnvironmentVariable("BRICKS_URL");
            InitializeComponent();
            Cef.Initialize(new CefSettings{CefCommandLineArgs =
            {
                {"disable-gpu-vsync","1"},
                {"disable-gpu","1"},
                {"disable-gpu-compositing","1"},
            }});
            var browser = new ChromiumWebBrowser()
            {
                Address = string.IsNullOrEmpty(bricksUrl) ? "https://mazhuravlev.github.io/bricks/" : bricksUrl,
                BrowserSettings = new BrowserSettings
                {
                    
                }
            };
            Grid.Children.Add(browser);
            var w = 759;
            var h = 619;
            browser.Width = w;
            browser.Height = h;
            Width = w + 15;
            Height = h + 5;
            browser.JavascriptObjectRepository.Register("vasya", new Vasya());
            KeyDown += (sender, args) =>
            {
                if(args.Key == Key.F12) browser.ShowDevTools();
            };
            Background = Brushes.Gray;
        }
    }

    class Vasya
    {
        private string _prevPath;

        public void SaveString(string key, string value)
        {
            try
            {
                File.WriteAllText(Path.Combine("strings", key), value);
            }
            catch
            {
                //
            }
        }
        
        public string LoadString(string key)
        {
            var file = Path.Combine("strings", key);
            if (!File.Exists(file)) return null;
            try
            {
                var str = File.ReadAllText(file);
                return str;
            }
            catch
            {
                return null;
            }
        }
        
        public void Save(string image)
        {
            var saveFileDialog = new SaveFileDialog
            {
                AddExtension = true,
                Filter = "png files (*.png)|*.png",
                InitialDirectory = _prevPath
            };
            var result = saveFileDialog.ShowDialog();
            if (!result.HasValue || !result.Value) return;
            _prevPath = Path.GetDirectoryName(saveFileDialog.FileName); 
            var bytes = Convert.FromBase64String(image.Substring(image.IndexOf(',') + 1));
            File.WriteAllBytes(saveFileDialog.FileName, bytes);
        }

        public void SavePalette(string json)
        {
            var saveFileDialog = new SaveFileDialog
            {
                AddExtension = true,
                Filter = "pallette files (*.pall)|*.pall",
                InitialDirectory = _prevPath
            };
            var result = saveFileDialog.ShowDialog();
            if (!result.HasValue || !result.Value) return;
            _prevPath = Path.GetDirectoryName(saveFileDialog.FileName); 
            File.WriteAllText(saveFileDialog.FileName, json);
        }
        
        public string LoadPalette()
        {
            var openFileDialog = new OpenFileDialog
            {
                AddExtension = true,
                Filter = "pallette files (*.pall)|*.pall",
                InitialDirectory = _prevPath
            };
            var result = openFileDialog.ShowDialog();
            if (!result.HasValue || !result.Value) return null;
            _prevPath = Path.GetDirectoryName(openFileDialog.FileName); 
            return File.ReadAllText(openFileDialog.FileName);
        }
    }
}