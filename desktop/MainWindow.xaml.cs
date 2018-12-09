﻿using System;
using System.Diagnostics;
using System.IO;
using System.Windows;
using CefSharp;
using CefSharp.Wpf;
using Microsoft.Win32;

namespace WpfApplication1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        public MainWindow()
        {
            var bricksUrl = Environment.GetEnvironmentVariable("BRICKS_URL");
            InitializeComponent();
            Cef.Initialize(new CefSettings());
            var browser = new ChromiumWebBrowser()
            {
                Address = string.IsNullOrEmpty(bricksUrl) ? "https://mazhuravlev.github.io/bricks/" : bricksUrl
            };
            Grid.Children.Add(browser);
            browser.Width = 600;
            browser.Height = 600;
            browser.JavascriptObjectRepository.Register("vasya", new Vasya());
            Button.Click += (sender, args) => browser.ShowDevTools();
        }
    }

    class Vasya
    {
        private string _prevPath;

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
    }
}