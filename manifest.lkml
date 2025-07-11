project_name: "tw_create_section_extension"

application: tw_create_section_extension {
  label: ""
  file: "dist/bundle.js"
  mount_points: {
    dashboard_vis: yes
    dashboard_tile: yes
    standalone: yes
  }
  entitlements: {
    core_api_methods: ["me", "artifact", "update_artifacts", "all_boards", "board", "dashboard"]
    use_form_submit: yes
    use_embeds: yes
    use_iframes: yes
    use_downloads: yes
    use_clipboard: yes
    navigation: yes
    new_window: yes
    local_storage: yes
    external_api_urls: ["https://lookerdev.zuelligpharma.com/*", "https://twbi-dashboard-dev-546150061126.asia-southeast1.run.app/*"]
    new_window_external_urls: ["https://lookerdev.zuelligpharma.com/*"]
  }
}
