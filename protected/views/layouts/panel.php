
<div class='wrapper-absolute'>
	<div class='container'>
			<div id='login-box'>
						<div class='login-warning'>
						</div>
						<span class='email-holder'><input id='email' type='text' class='input-medium' placeholder='Email'/><br></span>
						<input id='username' type='text' class='input-medium' placeholder='Username'/>
						<br>
						<input id='password' type='password' class='input-medium' placeholder='Password'/><br>
						<button class='btn login-btn'>Log In</button>
						<button class='btn btn-primary register-btn register-btn-shift'>Register</button>
						<button class='btn btn-danger cancel-btn'>Cancel</button>
						<br><br>
                            Or login with: <a href="#"><img src="http://phylo.cs.mcgill.ca/images/facebook.png" class="my-fb-login-button"/></a>
						<br><br>
					<a href='http://phylo.cs.mcgill.ca/reset.php'>Forgot Password?</a>
			</div>
	</div>
</div>

<div class='wrapper'>
			<div class='customize customize-bg'></div>
			<div class='customize customize-wrapper'>
				<div class='row customize-title'>
					Customize
				</div>
				<div class='customize-tab'>
					<div class='row'>
						<a href='javascript:void(0)' class='customize-tab-onselect span2 tag-theme'>Theme</a>
						<a href='javascript:void(0)' class='span2 tag-music'>Music</a>
					</div>
				</div>
				<div class='customize-body'>
					<div class='row'>
						<div class='customize-theme'>
							<div class='span4' >
								<div class='customize-boardColor'>
									<div class='row customize-title'>
											Board Color:
									</div>
									<div class='row'>
										<div class='colorCell customize-theme-cell customize-theme-onpick colorBG'>
										</div>
									</div>
								</div>
								<div class='customize-dnaColor'>
									<div class='customize-title row'>
										DNA Color:
									</div>
									<div class='row'>
										<div class='colorCell customize-theme-cell colorA'>
										</div>
										<div class='colorCell customize-theme-cell colorG '>
										</div>
										<div class='colorCell customize-theme-cell colorC'>
										</div>
										<div class='colorCell customize-theme-cell colorT'>
										</div>
									</div>
								</div>
								<div class='row'>
									<br><br>
									<a href='javascript:void(0);' class='customize-theme-reset btn-danger btn'>
										Restore Default	
									</a>	
								</div>
							</div>
							<div class='span5'>
								<canvas id='colorpad' width='256' height='256'>

								</canvas>
							</div>
						</div>
						<div class='customize-music'>
							<div class='row customize-title'>
								Current Music Theme	
							</div>
							<div class='row'>

							</div>
						</div>	
					</div>
				</div>
				<div class='customize-buttons'>
					<div class='row'>
						<a href='javascript:void(0)' class='customize-save btn btn-primary offset4 span2'>
							Save
						</a>
						<a href='javascript:void(0)' class='customize-cancel btn btn-primary span2'>
							Cancel
						</a>
					</div>
				</div>
			</div>
		</div>
		
		<script type="text/javascript">
			//scripts to update tags
			(function() {
				//updates tag,
				$("a").each(function(){
					if($(this).attr("href") == "#customize") 
					{
						$(this).attr("href","javascript:void(0);");
						$(this).attr("id","customize");
					} else if($(this).attr("href") == "#login") {
						$(this).attr("href","javascript:void(0);");
						$(this).attr("id","login");	
					}
				});
			})();
		</script>
		<!-- blueprint js framework -->
		<!--<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>js/bootstrap/bootstrap.js"></script>
		-->
		<!-- theming module -->
		<script src='/js/theme/main.theme.js' type='text/javascript'></script>		


		<!-- menu / page loading modules -->
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/page/main.page.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/page/hashbang.page.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/menu/events.menu.js' type='text/javascript'></script>
		